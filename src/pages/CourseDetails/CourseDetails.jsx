import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { coursesApi } from "../../api/courses.api";
import { scheduleApi } from "../../api/schedule.api";
import styles from "./CourseDetails.module.css";
import { Link } from "react-router-dom";
import { authApi } from "../../api/auth.api";
import { enrollmentApi } from "../../api/enrollments.api";

import calendar from "../../assets/icons/callendar.png";
import clock from "../../assets/icons/clock.png";

import devIcon from "../../assets/categories/development.png";
import designIcon from "../../assets/categories/design.png";
import businessIcon from "../../assets/categories/business.png";
import dataIcon from "../../assets/categories/datasci.png";
import marketingIcon from "../../assets/categories/marketing.png";
import warning from "../../assets/icons/warning.png";

export default function CourseDetails() {
  const { id } = useParams();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  const [weeklyOptions, setWeeklyOptions] = useState([]);
  const [timeOptions, setTimeOptions] = useState([]);
  const [sessionOptions, setSessionOptions] = useState([]);

  const [selectedWeek, setSelectedWeek] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);

  const [openStep, setOpenStep] = useState("week");

  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await authApi.me();
        console.log("🔥 USER:", res.data);
        setUser(res.data);
      } catch (err) {
        console.log("❌ NOT LOGGED IN");
        setUser(null);
      } finally {
        setAuthLoading(false);
      }
    };

    fetchUser();
  }, []);

  const isLoggedIn = !!user;
  const isProfileComplete = user?.profileComplete;
  const canEnroll = isLoggedIn && isProfileComplete;

  const categoryIcons = {
    development: devIcon,
    design: designIcon,
    business: businessIcon,
    "data-science": dataIcon,
    marketing: marketingIcon,
  };

  const avgRating = (() => {
    if (!course?.reviews?.length) return null;
    const total = course.reviews.reduce((acc, r) => acc + r.rating, 0);
    return (total / course.reviews.length).toFixed(1);
  })();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);

        const res = await coursesApi.getCourseById(id);
        const data = res.data;

        console.log("COURSE:", data);

        setCourse(data);
      } catch (err) {
        console.error("COURSE ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  useEffect(() => {
    const fetchWeeks = async () => {
      try {
        const res = await scheduleApi.getWeeklySchedules(id);

        console.log("WEEKLY SCHEDULES:", res.data);

        setWeeklyOptions(res.data || []);
      } catch (err) {
        console.error("WEEK ERROR:", err);
      }
    };

    fetchWeeks();
  }, [id]);

  const handleWeekSelect = async (week) => {
    console.log("👉 WEEK:", week);

    setSelectedWeek(week);
    setSelectedTime(null);
    setSelectedSession(null);
    setTimeOptions([]);
    setSessionOptions([]);

    setOpenStep("time");

    try {
      const res = await scheduleApi.getTimeSlots(id, week.id);

      console.log("TIME SLOTS:", res.data);

      setTimeOptions(res.data || []);
    } catch (err) {
      console.error("TIME ERROR:", err);
    }
  };

  const handleTimeSelect = async (time) => {
    console.log("TIME:", time);

    setSelectedTime(time);
    setSelectedSession(null);
    setSessionOptions([]);

    setOpenStep("session");

    try {
      const res = await scheduleApi.getSessionTypes(
        id,
        selectedWeek.id,
        time.id,
      );

      console.log("SESSIONS:", res.data);

      setSessionOptions(res.data || []);
    } catch (err) {
      console.error("SESSION ERROR:", err);
    }
  };

  const handleSessionSelect = (session) => {
    console.log("👉 SESSION:", session);
    setSelectedSession(session);
  };

  const sessionModifier = selectedSession?.priceModifier ?? 0;
  const totalPrice = course ? course.basePrice + sessionModifier : 0;

  if (loading) return <p>Loading...</p>;
  if (!course) return <p>Course not found</p>;

  const formatWeekLabel = (label) => {
    if (!label) return "";

    const map = {
      Monday: "Mon",
      Tuesday: "Tue",
      Wednesday: "Wed",
      Thursday: "Thu",
      Friday: "Fri",
      Saturday: "Sat",
      Sunday: "Sun",
    };

    // Weekend case
    if (label.toLowerCase().includes("weekend")) {
      return "Weekend";
    }

    return label
      .split("-")
      .map((part) => part.trim())
      .map((day) => map[day] || day)
      .join("–");
  };

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
        {/* LEFT */}
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

        {/* RIGHT */}
        <div className={styles.detailsRight}>
          {/* WEEK */}
          <div className={styles.stepWrapper}>
            {/* WEEK */}
            <div
              className={`${styles.step} ${
                openStep === "week" ? styles.activeStep : ""
              }`}
            >
              <div className={styles.stepTop}>
                <h3 onClick={() => setOpenStep("week")}>① Weekly Schedule</h3>
              </div>

              <div
                className={`${styles.stepBot} ${
                  openStep === "week" ? styles.open : styles.closed
                }`}
              >
                <div className={styles.options}>
                  {weeklyOptions.length === 0 && <p>Loading schedules...</p>}

                  {weeklyOptions.map((w) => (
                    <button
                      key={w.id}
                      className={`${styles.option} ${
                        selectedWeek?.id === w.id ? styles.active : ""
                      }`}
                      onClick={() => handleWeekSelect(w)}
                    >
                      {formatWeekLabel(w.label)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* TIME */}
            <div
              className={`${styles.step} ${
                openStep === "time" ? styles.activeStep : ""
              }`}
            >
              <div className={styles.stepTop}>
                <h3
                  onClick={() => selectedWeek && setOpenStep("time")}
                  style={{ opacity: selectedWeek ? 1 : 0.4 }}
                >
                  ② Time Slot
                </h3>
              </div>

              <div
                className={`${styles.stepBot} ${
                  openStep === "time" ? styles.open : styles.closed
                }`}
              >
                <div className={styles.options}>
                  {timeOptions.map((t) => (
                    <button
                      key={t.id}
                      className={`${styles.option} ${
                        selectedTime?.id === t.id ? styles.active : ""
                      }`}
                      onClick={() => handleTimeSelect(t)}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* SESSION */}
            <div
              className={`${styles.step} ${
                openStep === "session" ? styles.activeStep : ""
              }`}
            >
              <div className={styles.stepTop}>
                <h3
                  onClick={() => selectedTime && setOpenStep("session")}
                  style={{ opacity: selectedTime ? 1 : 0.4 }}
                >
                  ③ Session Type
                </h3>
              </div>

              <div
                className={`${styles.stepBot} ${
                  openStep === "session" ? styles.open : styles.closed
                }`}
              >
                <div className={styles.options}>
                  {sessionOptions.map((s) => {
                    const isFull = s.availableSeats === 0;
                    const lowSeats =
                      s.availableSeats > 0 && s.availableSeats < 5;

                    return (
                      <button
                        key={s.id}
                        disabled={isFull}
                        className={`${styles.option} ${
                          selectedSession?.id === s.id ? styles.active : ""
                        } ${isFull ? styles.disabled : ""}`}
                        onClick={() => handleSessionSelect(s)}
                      >
                        <div>{s.name}</div>

                        <div>
                          {s.priceModifier > 0
                            ? `+$${s.priceModifier}`
                            : "Included"}
                        </div>

                        <div>{s.availableSeats} seats</div>

                        {lowSeats && (
                          <div className={styles.warning}>
                            Only {s.availableSeats} left!
                          </div>
                        )}

                        {isFull && (
                          <div className={styles.full}>Fully Booked</div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* PRICE */}
          <div className={styles.priceBox}>
            <div className={styles.priceWrapper}>
              <div className={styles.priceTop}>
                <div className={styles.priceContainer}>
                  <h3 className={styles.priceLeft}>Total:</h3>
                  <h3>${totalPrice}</h3>
                </div>
              </div>
              <div className={styles.priceBottom}>
                <div className={styles.priceContainer}>
                  <p className={styles.priceLeft}>Base Price:</p>
                  <p>+ ${course.basePrice}</p>
                </div>
                <div className={styles.priceContainer}>
                  <p className={styles.priceLeft}>Session Type:</p>
                  <p>
                    {selectedSession
                      ? selectedSession.priceModifier > 0
                        ? `+ $${selectedSession.priceModifier}`
                        : "Included"
                      : "-"}
                  </p>
                </div>
              </div>
            </div>
            <button
              className={styles.enrollBtn}
              // disabled={!selectedSession}
              onClick={async () => {
                try {
                  console.log("ENROLL CLICKED");

                  if (!selectedWeek || !selectedTime || !selectedSession) {
                    console.warn("Missing selection:", {
                      selectedWeek,
                      selectedTime,
                      selectedSession,
                    });
                    return;
                  }

                  const payload = {
                    courseId: Number(id),
                    weeklyScheduleId: selectedWeek.id,
                    timeSlotId: selectedTime.id,
                    courseScheduleId: selectedSession.courseScheduleId,
                    force: false,
                  };

                  console.log("📦 PAYLOAD:", payload);

                  const res = await enrollmentApi.createEnrollment(payload);

                  console.log("✅ ENROLL SUCCESS:", res.data);
                } catch (err) {
                  console.error("❌ ENROLL ERROR:", err);
                }
              }}
            >
              Enroll Now
            </button>
          </div>

          {/* COMPLETE */}
          {!canEnroll && (
            <div className={styles.completeBox}>
              <div>
                <div className={styles.authHeading}>
                  <img src={warning} alt="" />
                  <h3>
                    {!isLoggedIn
                      ? "Authentication Required"
                      : "Profile Incomplete"}
                  </h3>
                </div>

                <p>
                  {!isLoggedIn
                    ? "You need to sign in before enrolling in this course."
                    : "Please complete your profile before enrolling in this course."}
                </p>
              </div>

              <div>
                <button
                  className={styles.authButton}
                  onClick={() => {
                    if (!isLoggedIn) {
                      window.location.href = "/login";
                    } else {
                      window.location.href = "/profile";
                    }
                  }}
                >
                  {!isLoggedIn ? "Sign In" : "Complete Profile"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
