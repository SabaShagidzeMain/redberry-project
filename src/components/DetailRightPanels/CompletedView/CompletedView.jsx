export default function CompletedView({ enrollment }) {
  const { schedule, course } = enrollment;

  return (
    <div className={styles.stateBox}>
      <h2>Completed</h2>

      <p>{schedule.weeklySchedule.label}</p>
      <p>{schedule.timeSlot.label}</p>
      <p>{schedule.sessionType.name}</p>

      {schedule.location && <p>{schedule.location}</p>}

      <p>Hours: {course.hours}</p>

      <p>Progress: 100%</p>

      <div className={styles.progressBar}>
        <div className={styles.progressFill} style={{ width: "100%" }} />
      </div>

      <button className={styles.retakeBtn}>Retake Course</button>

      <div className={styles.ratingBox}>
        <p>Rate your experience</p>
        <div>⭐⭐⭐⭐⭐</div>
      </div>
    </div>
  );
}
