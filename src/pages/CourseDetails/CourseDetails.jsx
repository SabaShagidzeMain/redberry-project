import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";

import { coursesApi } from "../../api/courses.api";
import { scheduleApi } from "../../api/schedule.api";
import { authApi } from "../../api/auth.api";
import { enrollmentApi } from "../../api/enrollments.api";

import styles from "./CourseDetails.module.css";

import calendar from "../../assets/icons/callendar.png";
import clock from "../../assets/icons/clock.png";

import devIcon from "../../assets/categories/development.png";
import designIcon from "../../assets/categories/design.png";
import businessIcon from "../../assets/categories/business.png";
import dataIcon from "../../assets/categories/datasci.png";
import marketingIcon from "../../assets/categories/marketing.png";

import InProgressView from "../../components/DetailRightPanels/InProgressView/InProgressView";
import CompletedView from "../../components/DetailRightPanels/CompletedView/CompletedView";
import EnrollmentFlow from "../../components/DetailRightPanels/EnrollmentFlow/EnrollmentFlow";

export default function CourseDetails() {
  const { id } = useParams();
  const courseId = Number(id);

  // ---------------- STATE ----------------
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
  const [enrollment, setEnrollment] = useState(null);

  const [allEnrollments, setAllEnrollments] = useState([]);

  // ---------------- DERIVED ----------------
  const isLoggedIn = !!user;
  const isProfileComplete = user?.profileComplete;

  const courseState = (() => {
    if (!enrollment) return "NOT_ENROLLED";
    if (enrollment.progress >= 100) return "COMPLETED";
    if (enrollment.progress > 0) return "IN_PROGRESS";
    return "NOT_ENROLLED";
  })();

  const reviews = course?.reviews ?? [];
  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1)
      : null;

  const sessionModifier = selectedSession?.priceModifier ?? 0;
  const totalPrice = course ? course.basePrice + sessionModifier : 0;

  // ---------------- FETCH ----------------
  const fetchEnrollment = async () => {
    try {
      const res = await enrollmentApi.getEnrollments();
      const raw = res.data?.data ?? res.data ?? [];
      const list = Array.isArray(raw) ? raw : [];

      console.log("ALL ENROLLMENTS:", list);

      setAllEnrollments(list);

      const found = list.find(
        (e) =>
          Number(e.course?.id) === courseId || Number(e.courseId) === courseId,
      );

      setEnrollment(found || null);
    } catch (err) {
      console.error("ENROLL FETCH ERROR:", err);
      setAllEnrollments([]);
      setEnrollment(null);
    }
  };

  useEffect(() => {
    fetchEnrollment();
  }, [id]);

  useEffect(() => {
    authApi
      .me()
      .then((res) => setUser(res.data))
      .catch(() => setUser(null));
  }, []);

  useEffect(() => {
    coursesApi
      .getCourseById(id)
      .then((res) => setCourse(res.data))
      .catch(() => setCourse(null))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    scheduleApi
      .getWeeklySchedules(id)
      .then((res) => setWeeklyOptions(res.data || []))
      .catch(() => setWeeklyOptions([]));
  }, [id]);

  // ---------------- HANDLERS ----------------
  const handleWeekSelect = async (week) => {
    setSelectedWeek(week);
    setSelectedTime(null);
    setSelectedSession(null);
    setTimeOptions([]);
    setSessionOptions([]);
    setOpenStep("time");

    try {
      const res = await scheduleApi.getTimeSlots(id, week.id);
      setTimeOptions(res.data || []);
    } catch {
      setTimeOptions([]);
    }
  };

  const handleTimeSelect = async (time) => {
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
      setSessionOptions(res.data || []);
    } catch {
      setSessionOptions([]);
    }
  };

  const handleSessionSelect = (session) => {
    setSelectedSession(session);
  };

  const handleCompleteCourse = async () => {
    try {
      await enrollmentApi.completeEnrollment(enrollment.id);
      await fetchEnrollment(); // triggers UI switch
    } catch (err) {
      console.error("COMPLETE ERROR:", err);
    }
  };

  // ---------------- HELPERS ----------------
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

    if (label.toLowerCase().includes("weekend")) return "Weekend";

    return label
      .split("-")
      .map((d) => map[d.trim()] || d)
      .join("–");
  };

  const categoryIcons = {
    development: devIcon,
    design: designIcon,
    business: businessIcon,
    "data-science": dataIcon,
    marketing: marketingIcon,
  };

  // ---------------- UI ----------------
  if (loading) return <p>Loading...</p>;
  if (!course) return <p>Course not found</p>;

  console.log("🔥 EnrollmentFlow MOUNTED");
  console.log("📦 EnrollmentFlow PROPS:", {
    selectedWeek,
    selectedTime,
    selectedSession,
    allEnrollments,
  });

  return (
    <div className={styles.page}>
      <div className={styles.breadcrumbs}>
        <Link to="/">Home &gt;</Link>
        <Link to="/browse">Browse &gt;</Link>
        <span>{course.title}</span>
      </div>

      <h1>{course.title}</h1>

      <div className={styles.detailsWrapper}>
        {/* LEFT */}
        <div className={styles.detailsLeft}>
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
              <p className={styles.rating}>⭐ {avgRating}</p>

              <div className={styles.tag}>
                <img
                  src={categoryIcons[course.category?.icon] || devIcon}
                  alt=""
                  className={styles.categoryIcon}
                />
                <p>{course.category?.name}</p>
              </div>
            </div>
          </div>

          <div className={styles.tag}>
            <img
              src={course.instructor?.avatar}
              alt=""
              className={styles.instructor}
            />
            <p>{course.instructor?.name}</p>
          </div>

          <div className={styles.description}>
            <h3>Course Description</h3>
            <p>{course.description}</p>
          </div>
        </div>

        {/* RIGHT */}
        <div className={styles.detailsRight}>
          {courseState === "NOT_ENROLLED" && (
            <EnrollmentFlow
              id={id}
              course={course}
              weeklyOptions={weeklyOptions}
              timeOptions={timeOptions}
              sessionOptions={sessionOptions}
              selectedWeek={selectedWeek}
              selectedTime={selectedTime}
              selectedSession={selectedSession}
              handleWeekSelect={handleWeekSelect}
              handleTimeSelect={handleTimeSelect}
              handleSessionSelect={handleSessionSelect}
              openStep={openStep}
              setOpenStep={setOpenStep}
              formatWeekLabel={formatWeekLabel}
              totalPrice={totalPrice}
              enrollmentApi={enrollmentApi}
              isLoggedIn={isLoggedIn}
              isProfileComplete={isProfileComplete}
              allEnrollments={allEnrollments}
            />
          )}

          {courseState === "IN_PROGRESS" && (
            <InProgressView
              enrollment={enrollment}
              onComplete={handleCompleteCourse}
            />
          )}

          {courseState === "COMPLETED" && (
            <CompletedView enrollment={enrollment} />
          )}
        </div>
      </div>
    </div>
  );
}
