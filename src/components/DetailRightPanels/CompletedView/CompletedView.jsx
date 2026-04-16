import { useState, useEffect } from "react";
import { coursesApi } from "../../../api/courses.api";

import styles from "./CompletedView.module.css";
import calendar from "../../../assets/icons/callendar.png";
import clock from "../../../assets/icons/clock.png";
import desktop from "../../../assets/icons/desktop.png";
import location from "../../../assets/icons/location.png";
import person from "../../../assets/icons/person.png";

export default function CompletedView({ enrollment }) {
  const { schedule, course } = enrollment;

  const progress = enrollment.progress ?? 0;

  const weekly = schedule.weeklySchedule?.label || "N/A";
  const time = schedule.timeSlot?.label || "N/A";
  const session = schedule.sessionType?.name || "N/A";

  const cleanTime = time?.match(/\((.*?)\)/)?.[1] || time;

  const submitRating = async (value) => {
    if (hasRated) return;

    try {
      setRating(value);

      await coursesApi.submitReview(course.id, {
        rating: value,
      });

      localStorage.setItem(`rating_${course.id}`, value);

      setHasRated(true);
    } catch (err) {
      console.error("RATING ERROR:", err);
    }
  };

  useEffect(() => {
    const savedRating = localStorage.getItem(`rating_${course.id}`);

    if (savedRating) {
      setRating(Number(savedRating));
      setHasRated(true);
    }
  }, [course.id]);

  const [rating, setRating] = useState(0);
  const [hasRated, setHasRated] = useState(false);

  return (
    <div className={styles.stateBox}>
      <div className={styles.enrolledHeader}>
        <h2>Completed</h2>
      </div>

      <div className={styles.infoBox}>
        <div className={styles.infoBoxItem}>
          <img src={calendar} alt="" />
          <p>{weekly}</p>
        </div>
        <div className={styles.infoBoxItem}>
          <img src={clock} alt="" />
          <p>{cleanTime}</p>
        </div>
        <div className={styles.infoBoxItem}>
          <img src={course.mode === "ONLINE" ? desktop : person} alt="" />
          <p>{session === "in_person" ? "In Person" : "Online"}</p>
        </div>
        <div className={styles.infoBoxItem}>
          <img src={course.mode === "ONLINE" ? desktop : location} alt="" />
          <p> {schedule.location && <span>{schedule.location}</span>}</p>
        </div>
      </div>

      <div className={styles.progressSection}>
        <p>Progress: {progress}%</p>

        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className={styles.actions}>
        <button className={styles.primaryBtn}>Retake Course</button>
      </div>

      <div className={styles.ratingBox}>
        <p className={styles.rateText}>
          {hasRated ? "Thank you for your feedback" : "Rate your experience"}
        </p>

        <div className={styles.stars}>
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              onClick={() => !hasRated && submitRating(star)}
              style={{
                cursor: hasRated ? "default" : "pointer",
                fontSize: "24px",
                color: star <= rating ? "#FFD700" : "#ccc",
                opacity: hasRated ? 0.8 : 1,
              }}
            >
              ★
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
