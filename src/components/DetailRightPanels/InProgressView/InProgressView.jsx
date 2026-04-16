import styles from "./InProgressView.module.css";

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

  return (
    <div className={styles.stateBox}>
      <h2>Course In Progress</h2>

      <div className={styles.infoBox}>
        <p>
          <strong>Course:</strong> {course.title || "Unknown"}
        </p>

        <p>
          <strong>Schedule:</strong> {weekly}
        </p>

        <p>
          <strong>Time:</strong> {time}
        </p>

        <p>
          <strong>Session:</strong> {session}
        </p>
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
        <button className={styles.primaryBtn}>Continue Learning</button>
        <button className={styles.secondaryBtn}>View Materials</button>
      </div>
    </div>
  );
}
