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
        <p className={styles.rateText}>Rate your experience</p>
        <div className={styles.stars}>
          <p>⭐⭐⭐⭐⭐</p>
        </div>
      </div>
    </div>
  );
}
