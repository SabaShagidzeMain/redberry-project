import styles from "./InProgressView.module.css";
import calendar from "../../../assets/icons/callendar.png";
import clock from "../../../assets/icons/clock.png";
import desktop from "../../../assets/icons/desktop.png";
import location from "../../../assets/icons/location.png";
import person from "../../../assets/icons/person.png";

export default function InProgressView({ enrollment }) {
  if (!enrollment) {
    return <p>Loading progress...</p>;
  }

  const progress = enrollment.progress ?? 0;

  const course = enrollment.course || {};
  const schedule = enrollment.schedule || {};

  const weekly = schedule.weeklySchedule?.label || "N/A";
  const time = schedule.timeSlot?.label || "N/A";
  const session = schedule.sessionType?.name || "N/A";

  const cleanTime = time?.match(/\((.*?)\)/)?.[1] || time;

  return (
    <div className={styles.stateBox}>
      <div className={styles.enrolledHeader}>
        <h2>Enrolled</h2>
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
        <button className={styles.primaryBtn}>Complete Course</button>
      </div>
    </div>
  );
}
