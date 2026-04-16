import styles from "./EnrollmentFlow.module.css";
import { useState } from "react";

import ConfirmModal from "../../Modals/ConfirmModal/ConfirmModal";

export default function CourseDetailsRight({
  openStep,
  setOpenStep,

  weeklyOptions = [],
  timeOptions = [],
  sessionOptions = [],

  selectedWeek,
  selectedTime,
  selectedSession,

  handleWeekSelect,
  handleTimeSelect,
  handleSessionSelect,

  formatWeekLabel,

  totalPrice,
  course,
  id,

  enrollmentApi,
  allEnrollments = [],
  onEnroll,
}) {
  const [showConflictModal, setShowConflictModal] = useState(false);
  const [conflictEnrollment, setConflictEnrollment] = useState(null);

  const debug = (...args) => console.log("🧠 [EnrollmentFlow]", ...args);

  // -------------------------
  // CONFLICT DETECTION
  // -------------------------
  const findConflict = () => {
    debug("Checking conflict...");

    if (!selectedWeek || !selectedTime) {
      debug("Missing selection → no conflict check", {
        selectedWeek,
        selectedTime,
      });
      return null;
    }

    const conflict = allEnrollments.find((e) => {
      const weekId = e?.schedule?.weeklySchedule?.id;
      const timeId = e?.schedule?.timeSlot?.id;

      const weekMatch = Number(weekId) === Number(selectedWeek?.id);

      const timeMatch = Number(timeId) === Number(selectedTime?.id);

      const isConflict = weekMatch && timeMatch;

      if (isConflict) {
        debug("⚠️ Conflict found:", e?.course?.title);
      }

      return isConflict;
    });

    debug("Conflict result:", conflict);
    return conflict || null;
  };

  // -------------------------
  // ENROLL HANDLER
  // -------------------------
  const handleEnroll = async (force = false) => {
    try {
      debug("Enroll clicked → force:", force);

      const conflict = findConflict();

      if (conflict && !force) {
        debug("⛔ Blocking enroll → opening modal");

        setConflictEnrollment(conflict);
        setShowConflictModal(true);
        return;
      }

      if (!selectedWeek || !selectedTime || !selectedSession) {
        debug("❌ Missing selections:", {
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
        force,
      };

      debug("📦 Sending payload:", payload);

      const res = await enrollmentApi.createEnrollment(payload);

      debug("✅ Enrollment success:", res?.data);

      await onEnroll?.();
    } catch (err) {
      console.error("❌ ENROLL ERROR:", err);
    }
  };

  return (
    <div className={styles.detailsRight}>
      {/* WEEK */}
      <div className={styles.stepWrapper}>
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
            <h3 onClick={() => selectedWeek && setOpenStep("time")}>
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
            <h3 onClick={() => selectedTime && setOpenStep("session")}>
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
                    {isFull && <div className={styles.full}>Fully Booked</div>}
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
            <h3>Total: ${totalPrice}</h3>
          </div>
        </div>

        <button
          className={styles.enrollBtn}
          onClick={() => handleEnroll(false)}
        >
          Enroll Now
        </button>
      </div>
      {showConflictModal && conflictEnrollment && (
        <ConfirmModal
          title="Schedule Conflict"
          message={
            <>
              You are already enrolled in{" "}
              <b>{conflictEnrollment.course?.title}</b>
              <br />
              with the same schedule:
              <br />
              {conflictEnrollment.schedule?.weeklySchedule?.label} at{" "}
              {conflictEnrollment.schedule?.timeSlot?.label}
            </>
          }
          confirmText="Continue Anyway"
          cancelText="Cancel"
          onCancel={() => setShowConflictModal(false)}
          onConfirm={() => {
            setShowConflictModal(false);
            handleEnroll(true);
          }}
        />
      )}
    </div>
  );
}
