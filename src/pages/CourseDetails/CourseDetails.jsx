import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { coursesApi } from "../../api/courses.api";
import styles from "./CourseDetails.module.css";
import { Link } from "react-router-dom";
import calendar from "../../assets/icons/callendar.png";
import clock from "../../assets/icons/clock.png";

import devIcon from "../../assets/categories/development.png";
import designIcon from "../../assets/categories/design.png";
import businessIcon from "../../assets/categories/business.png";
import dataIcon from "../../assets/categories/datasci.png";
import marketingIcon from "../../assets/categories/marketing.png";

export default function CourseDetails() {
  const { id } = useParams();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  const [schedule, setSchedule] = useState(null);

  const avgRating = (() => {
    if (!course?.reviews?.length) return null;

    const total = course.reviews.reduce((acc, r) => acc + r.rating, 0);
    return (total / course.reviews.length).toFixed(1);
  })();

  const categoryIcons = {
    development: devIcon,
    design: designIcon,
    business: businessIcon,
    "data-science": dataIcon,
    marketing: marketingIcon,
  };

  const [selectedWeek, setSelectedWeek] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);

  const weeklyOptions = schedule?.weeklySchedule
    ? [schedule.weeklySchedule]
    : [];

  const timeOptions = schedule?.timeSlot ? [schedule.timeSlot] : [];

  const sessionOptions = schedule?.sessionType ? [schedule.sessionType] : [];

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);

        const res = await coursesApi.getCourseById(id);
        const data = res.data;

        setCourse(data);

        setSchedule(data.enrollment?.schedule || null);
      } catch (err) {
        console.error("❌ COURSE FETCH ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!course) return <p>Course not found</p>;

  return (
    <div className={styles.page}>
      <div className={styles.breadcrumbs}>
        <Link to="/" className={styles.wayHome}>
          Home &nbsp;&gt;&nbsp;
        </Link>
        <Link to="/browse" className={styles.wayHome}>
          Browse &nbsp;&gt;&nbsp;
        </Link>
        <span>{course.title}</span>
      </div>
      <div className={styles.detailsWrapper}>
        <div className={styles.detailsLeft}>
          <h1>{course.title}</h1>
          <img src={course.image} alt="" />
          <div className={styles.metaFirst}>
            <div className={styles.metaLeft}>
              <div className={styles.infoWrapper}>
                <img src={calendar} alt="" />
                <p>{course.durationWeeks} Weeks</p>
              </div>
              <div className={styles.infoWrapper}>
                <img src={clock} alt="" />
                <p>120 Hours</p>
              </div>
            </div>
            <div className={styles.metaRight}>
              <div>
                {" "}
                <p className={styles.rating}>⭐ {avgRating}</p>
              </div>
              <div className={styles.tag}>
                <img
                  src={categoryIcons[course.category?.icon] || devIcon}
                  alt={course.category?.name}
                  className={styles.categoryIcon}
                />
                <p>{course.category?.name}</p>
              </div>
            </div>
          </div>
          <div>
            <div className={styles.tag}>
              <img
                src={course.instructor?.avatar}
                alt=""
                className={styles.instructor}
              />
              <p>{course.instructor?.name}</p>
            </div>
          </div>
          <div className={styles.description}>
            <h3>Course Description</h3>
            <p>{course.description}</p>
          </div>
        </div>
        <div className={styles.detailsRight}>
          <h3>Enroll</h3>

          {/* WEEKLY SCHEDULE */}
          <div className={styles.dropdownGroup}>
            <label>Weekly Schedule</label>
            <select
              value={selectedWeek?.id || ""}
              onChange={(e) =>
                setSelectedWeek(
                  weeklyOptions.find((w) => w.id === Number(e.target.value)),
                )
              }
            >
              <option value="">Select schedule</option>
              {weeklyOptions.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.label}
                </option>
              ))}
            </select>
          </div>

          {/* TIME SLOT */}
          <div className={styles.dropdownGroup}>
            <label>Time Slot</label>
            <select
              value={selectedTime?.id || ""}
              onChange={(e) =>
                setSelectedTime(
                  timeOptions.find((t) => t.id === Number(e.target.value)),
                )
              }
            >
              <option value="">Select time</option>
              {timeOptions.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          {/* SESSION TYPE */}
          <div className={styles.dropdownGroup}>
            <label>Session Type</label>
            <select
              value={selectedSession?.id || ""}
              onChange={(e) =>
                setSelectedSession(
                  sessionOptions.find((s) => s.id === Number(e.target.value)),
                )
              }
            >
              <option value="">Select type</option>
              {sessionOptions.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} (+${s.priceModifier})
                </option>
              ))}
            </select>
          </div>

          {/* PRICE */}
          <div className={styles.priceBox}>
            <p>Base price: ${course.basePrice}</p>
            <p>
              Total: ${course.basePrice + (selectedSession?.priceModifier || 0)}
            </p>
          </div>

          <button className={styles.enrollBtn}>Enroll Now</button>
        </div>
      </div>
    </div>
  );
}
