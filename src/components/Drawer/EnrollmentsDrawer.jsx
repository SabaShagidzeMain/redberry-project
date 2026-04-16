import { useEffect, useState } from "react";
import styles from "./EnrollmentsDrawer.module.css";
import { enrollmentApi } from "../../api/enrollments.api";
import calendar from "../../assets/icons/callendar.png";
import clock from "../../assets/icons/clock.png";
import user from "../../assets/icons/person.png";
import location from "../../assets/icons/location.png";
import { Link } from "react-router-dom";

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
            Total Enrollments:
            <span className={styles.count}> {enrollments.length}</span>
          </p>
        </div>

        <div className={styles.body}>
          <div className={styles.bodyInner}>
            {loading && <p>Loading...</p>}

            {!loading && enrollments.length === 0 && (
              <p>No enrolled courses yet.</p>
            )}

            {enrollments.map((e) => (
              <div key={e.id} className={styles.card}>
                <div className={styles.cardTop}>
                  <div>
                    <img src={e.course.image} alt="" />
                  </div>
                  <div className={styles.info}>
                    <div className={styles.infoFirst}>
                      <p className={styles.instructor}>
                        {e.course.instructor.name}
                      </p>
                      <p>⭐ {e.course.avgRating}</p>
                    </div>
                    <h4>{e.course.title}</h4>
                    <div className={styles.infoList}>
                      <div className={styles.infoListItem}>
                        <img src={calendar} alt="" />
                        <p>{e.schedule.weeklySchedule.label}</p>
                      </div>
                      <div className={styles.infoListItem}>
                        <img src={clock} alt="" />
                        <p>{e.schedule.timeSlot.label}</p>
                      </div>
                      <div className={styles.infoListItem}>
                        <img src={user} alt="" />
                        <p>{e.schedule.sessionType.name}</p>
                      </div>
                      <div className={styles.infoListItem}>
                        {e.schedule.location && (
                          <>
                            <img src={location} alt="" />
                            <p> {e.schedule.location}</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className={styles.cardBot}>
                  <div className={styles.botLeft}>
                    <p>Progress: {e.progress}%</p>
                    <div className={styles.progressBar}>
                      <div
                        className={styles.progressFill}
                        style={{ width: `${e.progress}%` }}
                      />
                    </div>
                  </div>
                  <div className={styles.cardButton} onClick={onClose}>
                    <Link to={`/course/${e.course.id}`}>View</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
