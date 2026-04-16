import styles from "./EnrollmentFlow.module.css";

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
  canEnroll,
  isLoggedIn,
  warning,
}) {
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
              {weeklyOptions.length === 0 && <p>Loading schedules...</p>}

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
            <h3
              onClick={() => selectedWeek && setOpenStep("time")}
              style={{ opacity: selectedWeek ? 1 : 0.4 }}
            >
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
            <h3
              onClick={() => selectedTime && setOpenStep("session")}
              style={{ opacity: selectedTime ? 1 : 0.4 }}
            >
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
                const lowSeats = s.availableSeats > 0 && s.availableSeats < 5;

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

                    {lowSeats && (
                      <div className={styles.warning}>
                        Only {s.availableSeats} left!
                      </div>
                    )}

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
            <div className={styles.priceContainer}>
              <h3 className={styles.priceLeft}>Total:</h3>
              <h3>${totalPrice}</h3>
            </div>
          </div>

          <div className={styles.priceBottom}>
            <div className={styles.priceContainer}>
              <p className={styles.priceLeft}>Base Price:</p>
              <p>+ ${course.basePrice}</p>
            </div>

            <div className={styles.priceContainer}>
              <p className={styles.priceLeft}>Session Type:</p>
              <p>
                {selectedSession
                  ? selectedSession.priceModifier > 0
                    ? `+ $${selectedSession.priceModifier}`
                    : "Included"
                  : "-"}
              </p>
            </div>
          </div>
        </div>

        <button
          className={styles.enrollBtn}
          onClick={async () => {
            try {
              console.log("ENROLL CLICKED");

              if (!selectedWeek || !selectedTime || !selectedSession) {
                console.warn("Missing selection:", {
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
                force: false,
              };

              console.log("📦 PAYLOAD:", payload);

              const res = await enrollmentApi.createEnrollment(payload);

              console.log("✅ ENROLL SUCCESS:", res.data);
            } catch (err) {
              console.error("❌ ENROLL ERROR:", err);
            }
          }}
        >
          Enroll Now
        </button>
      </div>

      {/* COMPLETE */}
      {!canEnroll && (
        <div className={styles.completeBox}>
          <div>
            <div className={styles.authHeading}>
              <img src={warning} alt="" />
              <h3>
                {!isLoggedIn ? "Authentication Required" : "Profile Incomplete"}
              </h3>
            </div>

            <p>
              {!isLoggedIn
                ? "You need to sign in before enrolling in this course."
                : "Please complete your profile before enrolling in this course."}
            </p>
          </div>

          <div>
            <button
              className={styles.authButton}
              onClick={() => {
                if (!isLoggedIn) {
                  window.location.href = "/login";
                } else {
                  window.location.href = "/profile";
                }
              }}
            >
              {!isLoggedIn ? "Sign In" : "Complete Profile"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
