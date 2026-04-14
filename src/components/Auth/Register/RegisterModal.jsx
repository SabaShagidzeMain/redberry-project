import { useState, useRef } from "react";
import Modal from "../../Modal/Modal";
import { authApi } from "../../../api/auth.api";
import { setToken } from "../../../utils/auth";
import styles from "./RegisterModal.module.css";

export default function RegisterModal({ onClose }) {
  const fileInputRef = useRef(null);

  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    email: "",
    password: "",
    password_confirmation: "",
    username: "",
    avatar: null,
  });

  // -------------------------
  // INPUT
  // -------------------------
  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // -------------------------
  // FILE PICK (CLICK)
  // -------------------------
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setForm((prev) => ({
      ...prev,
      avatar: file,
    }));
  };

  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

  // -------------------------
  // DRAG & DROP (CLEAN + WORKING)
  // -------------------------
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();

    const file = e.dataTransfer?.files?.[0];
    if (!file) return;

    setForm((prev) => ({
      ...prev,
      avatar: file,
    }));
  };

  // -------------------------
  // REGISTER
  // -------------------------
  const handleRegister = async () => {
    try {
      if (form.password !== form.password_confirmation) {
        console.error("Passwords do not match");
        return;
      }

      const formData = new FormData();

      formData.append("email", form.email);
      formData.append("password", form.password);
      formData.append("password_confirmation", form.password_confirmation);
      formData.append("username", form.username);

      if (form.avatar) {
        formData.append("avatar", form.avatar);
      }

      const res = await authApi.register(formData);

      setToken(res.data.token);

      console.log("REGISTER SUCCESS:", res.data.user);

      onClose();
    } catch (err) {
      console.error("REGISTER ERROR:", err.message);
    }
  };

  // -------------------------
  // UI
  // -------------------------
  return (
    <Modal onClose={onClose} className={styles.regModal}>
      <div className={styles.regText}>
        <h2>Create Account</h2>
        <p>Join and start learning today</p>
      </div>

      {/* STEP INDICATOR */}
      <div className={styles.stepSpan}>
        <span
          className={
            step > 1
              ? styles.completed
              : step === 1
                ? styles.current
                : styles.upcoming
          }
        />
        <span
          className={
            step > 2
              ? styles.completed
              : step === 2
                ? styles.current
                : styles.upcoming
          }
        />
        <span className={step === 3 ? styles.current : styles.upcoming} />
      </div>

      {/* STEP 1 */}
      {step === 1 && (
        <>
          <p className={styles.regInputText}>Email</p>
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className={styles.regInputField}
          />
          <button onClick={() => setStep(2)} className={styles.regButton}>
            Next
          </button>
        </>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <>
          <p className={styles.regInputText}>Password</p>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            className={styles.regInputField}
          />

          <p className={styles.regInputText}>Confirm Password</p>
          <input
            type="password"
            name="password_confirmation"
            value={form.password_confirmation}
            onChange={handleChange}
            placeholder="Confirm Password"
            className={styles.regInputField}
          />

          <button onClick={() => setStep(1)} className={styles.regButtonBack}>
            <img src="src/assets/icons/weui_arrow-outlined.png" alt="" />
          </button>
          <button onClick={() => setStep(3)} className={styles.regButton}>
            Next
          </button>
        </>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <>
          <p className={styles.regInputText}>Username</p>
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Username"
            className={styles.regInputField}
          />

          <p className={styles.regInputText}>Upload Avatar</p>
          <div
            className={styles.uploadBox}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={handleClickUpload}
          >
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              className={styles.hiddenInput}
            />

            {!form.avatar ? (
              <>
                <img
                  src="src/assets/icons/upload.png"
                  alt=""
                  className={styles.regUploadIcon}
                />

                <p className={styles.regUploadText}>
                  Drag and drop or{" "}
                  <span className={styles.regUploadSpan}>Upload file</span>
                </p>
                <p className={styles.regUploadTags}>JPG, PNG or WebP</p>
              </>
            ) : (
              <div className={styles.preview}>
                <img
                  src={URL.createObjectURL(form.avatar)}
                  alt="preview"
                  className={styles.previewImg}
                />

                <p className={styles.fileName}>{form.avatar.name}</p>
              </div>
            )}
          </div>

          <button className={styles.regButtonBack} onClick={() => setStep(2)}>
            <img src="src/assets/icons/weui_arrow-outlined.png" alt="" />
          </button>
          <button className={styles.regButton} onClick={handleRegister}>
            Sign Up
          </button>
        </>
      )}
    </Modal>
  );
}
