import { useEffect, useState } from "react";
import styles from "./EnrollmentsDrawer.module.css";
import { enrollmentApi } from "../../api/enrollments.api";

export default function EnrollmentsDrawer({ open, onClose }) {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(false);
  const totalEnrollments = enrollments.length;

  useEffect(() => {
    if (!open) return;

    const fetchEnrollments = async () => {
      try {
        setLoading(true);
        const res = await enrollmentApi.getEnrollments();

        console.log("ENROLLMENTS:", res.data);
        setEnrollments(res.data || []);
      } catch (err) {
        console.error("ENROLLMENTS ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, [open]);

  return (
    <>
      {/* overlay */}
      <div
        className={`${styles.overlay} ${open ? styles.show : ""}`}
        onClick={onClose}
      />

      {/* drawer */}
      <div className={`${styles.drawer} ${open ? styles.open : ""}`}>
        <div className={styles.header}>
          <h3>Enrolled Courses</h3>
          <p>
            Total Enrollments:{" "}
            <span className={styles.count}>{enrollments.length}</span>
          </p>
        </div>

        <div className={styles.body}>
          {loading && <p>Loading...</p>}

          {!loading && enrollments.length === 0 && (
            <p>No enrolled courses yet.</p>
          )}

          {enrollments.map((e) => (
            <div key={e.id} className={styles.card}>
              <img src={e.course.image} alt="" />

              <div>
                <h4>{e.course.title}</h4>

                <p>
                  {e.schedule.weeklySchedule.label} •{" "}
                  {e.schedule.timeSlot.label}
                </p>

                <p>Progress: {e.progress}%</p>

                <p>Total: ${e.totalPrice}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
