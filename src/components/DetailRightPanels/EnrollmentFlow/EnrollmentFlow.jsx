import styles from "./EnrollmentFlow.module.css";
import { useState } from "react";

import ConfirmModal from "../../Modals/ConfirmModal/ConfirmModal";
import LoginModal from "../../Modals/LoginModal/LoginModal";
import ProfileModal from "../../Modals/ProfileModal/ProfileModal";

import warning from "../../../assets/icons/warning.png";

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

  isLoggedIn,
  isProfileComplete,
}) {
  const [showConflictModal, setShowConflictModal] = useState(false);
  const [conflictEnrollment, setConflictEnrollment] = useState(null);

  // ✅ NEW: modal control states
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // -------------------------
  // ACCESS CHECK
  // -------------------------
  const handleAccessClick = () => {
    if (!isLoggedIn) {
      debug("🔐 opening login modal");
      setShowLoginModal(true);
      return;
    }

    if (!isProfileComplete) {
      debug("👤 opening profile modal");
      setShowProfileModal(true);
      return;
    }

    handleEnroll(false);
  };

  // -------------------------
  // CONFLICT DETECTION
  // -------------------------
  const findConflict = () => {
    if (!selectedWeek || !selectedTime) return null;

    return allEnrollments.find((e) => {
      const weekMatch =
        Number(e?.schedule?.weeklySchedule?.id) === Number(selectedWeek?.id);

      const timeMatch =
        Number(e?.schedule?.timeSlot?.id) === Number(selectedTime?.id);

      return weekMatch && timeMatch;
    });
  };

  // -------------------------
  // ENROLL HANDLER
  // -------------------------
  const handleEnroll = async (force = false) => {
    try {
      const conflict = findConflict();

      if (conflict && !force) {
        setConflictEnrollment(conflict);
        setShowConflictModal(true);
        return;
      }

      const payload = {
        courseId: Number(id),
        weeklyScheduleId: selectedWeek.id,
        timeSlotId: selectedTime.id,
        courseScheduleId: selectedSession.courseScheduleId,
        force,
      };

      const res = await enrollmentApi.createEnrollment(payload);

      await onEnroll?.();
    } catch (err) {
      console.error("ENROLL ERROR:", err);
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

        <button className={styles.enrollBtn} onClick={handleAccessClick}>
          Enroll Now
        </button>
      </div>
      {!isLoggedIn || !isProfileComplete ? (
        <div className={styles.completeBox}>
          <div className={styles.completeWrapper}>
            <div className={styles.headingWrapper}>
              <img src={warning} alt="" />
              {!isLoggedIn || !isProfileComplete ? (
                <h3 className={styles.authHeading}>
                  {!isLoggedIn ? "Sign In." : "Complete Your Profile."}
                </h3>
              ) : null}
            </div>
            {!isLoggedIn || !isProfileComplete ? (
              <p className={styles.profileWarning}>
                {!isLoggedIn
                  ? "You need to sign in to enroll in this course."
                  : "Please complete your profile before enrolling."}
              </p>
            ) : null}
          </div>
          <div>
            {!isLoggedIn || !isProfileComplete ? (
              <button className={styles.authButton} onClick={handleAccessClick}>
                {!isLoggedIn ? "Sign In" : "Complete"}
              </button>
            ) : null}
          </div>
        </div>
      ) : null}

      {/* CONFIRM MODAL */}
      {showConflictModal && conflictEnrollment && (
        <ConfirmModal
          title="Schedule Conflict"
          message={
            <>
              You are already enrolled in{" "}
              <b>{conflictEnrollment.course?.title}</b>
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

      {/* 🔥 LOGIN MODAL */}
      {showLoginModal && (
        <LoginModal onClose={() => setShowLoginModal(false)} />
      )}

      {/* 🔥 PROFILE MODAL */}
      {showProfileModal && (
        <ProfileModal onClose={() => setShowProfileModal(false)} />
      )}
    </div>
  );
}
