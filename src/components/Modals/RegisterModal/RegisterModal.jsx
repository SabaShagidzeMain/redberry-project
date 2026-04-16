import { useState, useRef } from "react";
import Modal from "../../Modal/Modal";
import { authApi } from "../../../api/auth.api";
import { setToken } from "../../../utils/auth";
import styles from "./RegisterModal.module.css";

export default function RegisterModal({ onClose }) {
  const fileInputRef = useRef(null);

  const [step, setStep] = useState(1);

  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    email: "",
    password: "",
    password_confirmation: "",
    username: "",
    avatar: null,
  });

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

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

  const handleRegister = async () => {
    if (!validateStep3()) return;

    try {
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

      onClose();
    } catch (err) {
      console.error("REGISTER ERROR FULL:", err);

      // 1. Case: backend returned structured axios error
      const data = err.response?.data;

      if (data?.errors) {
        const normalized = normalizeErrors(data.errors);

        setErrors((prev) => ({
          ...prev,
          ...normalized,
        }));

        if (normalized.email) setStep(1);
        if (normalized.username) setStep(3);

        return;
      }

      // 2. Case: plain thrown Error (your current case)
      if (err.message) {
        setErrors((prev) => ({
          ...prev,
          general: err.message,
        }));

        return;
      }

      // 3. fallback
      setErrors({
        general: "Something went wrong",
      });
    }
  };
  const validateStep1 = () => {
    const newErrors = {};

    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Invalid email format";
    }

    setErrors((prev) => ({ ...prev, ...newErrors }));

    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};

    if (!form.password || form.password.length < 3) {
      newErrors.password = "Password must be at least 3 characters";
    }

    if (form.password !== form.password_confirmation) {
      newErrors.password_confirmation = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors = {};

    if (!form.username || form.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const normalizeErrors = (backendErrors) => {
    const result = {};

    Object.entries(backendErrors).forEach(([key, value]) => {
      result[key] = Array.isArray(value) ? value[0] : value;
    });

    return result;
  };

  return (
    <Modal onClose={onClose} className={styles.regModal}>
      <div className={styles.regText}>
        <h2>Create Account</h2>
        <p>Join and start learning today</p>
      </div>

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
          {errors.email && <p className={styles.error}>{errors.email}</p>}
          <button
            onClick={() => {
              if (validateStep1()) setStep(2);
            }}
            className={styles.regButton}
          >
            Next
          </button>
          <div className={styles.modal_footer}>
            <div className={styles.orContainer}>
              <span />
              <p>or</p>
              <span />
            </div>
            <div>
              <p className={styles.signUp}>
                Already have an account? <a href="#">Log In</a>
              </p>
            </div>
          </div>
        </>
      )}

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
          {errors.password && <p className={styles.error}>{errors.password}</p>}

          <p className={styles.regInputText}>Confirm Password</p>
          <input
            type="password"
            name="password_confirmation"
            value={form.password_confirmation}
            onChange={handleChange}
            placeholder="Confirm Password"
            className={styles.regInputField}
          />
          <p className={styles.error}>{errors.password_confirmation}</p>

          <button onClick={() => setStep(1)} className={styles.regButtonBack}>
            <img src="src/assets/icons/weui_arrow-outlined.png" alt="" />
          </button>
          <button
            onClick={() => {
              if (validateStep2()) setStep(3);
            }}
            className={styles.regButton}
          >
            Next
          </button>
          <div className={styles.modal_footer}>
            <div className={styles.orContainer}>
              <span />
              <p>or</p>
              <span />
            </div>
            <div>
              <p className={styles.signUp}>
                Already have an account? <a href="#">Log In</a>
              </p>
            </div>
          </div>
        </>
      )}

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
          {errors.username && <p className={styles.error}>{errors.username}</p>}

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

          {errors.general && <p className={styles.error}>{errors.general}</p>}

          <button className={styles.regButtonBack} onClick={() => setStep(2)}>
            <img src="src/assets/icons/weui_arrow-outlined.png" alt="" />
          </button>
          <button className={styles.regButton} onClick={handleRegister}>
            Sign Up
          </button>
          <div className={styles.modal_footer}>
            <div className={styles.orContainer}>
              <span />
              <p>or</p>
              <span />
            </div>
            <div>
              <p className={styles.signUp}>
                Already have an account? <a href="#">Log In</a>
              </p>
            </div>
          </div>
        </>
      )}
    </Modal>
  );
}
