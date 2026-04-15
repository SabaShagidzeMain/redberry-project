import { useState, useRef } from "react";
import Modal from "../../Modal/Modal";
import styles from "./ProfileModal.module.css";
import { useAuth } from "../../../context/AuthContext";
import { authApi } from "../../../api/auth.api";

export default function ProfileModal({ onClose }) {
  const { user, login } = useAuth();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    mobileNumber: user?.mobileNumber || "",
    age: user?.age || "",
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
  // FILE
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

  const handleDrop = (e) => {
    e.preventDefault();

    const file = e.dataTransfer?.files?.[0];
    if (!file) return;

    setForm((prev) => ({
      ...prev,
      avatar: file,
    }));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // -------------------------
  // SAVE PROFILE
  // -------------------------
  const handleSave = async () => {
    try {
      const formData = new FormData();

      formData.append("fullName", form.fullName);
      formData.append("email", form.email);
      formData.append("mobileNumber", form.mobileNumber);
      formData.append("age", form.age);

      if (form.avatar) {
        formData.append("avatar", form.avatar);
      }

      const res = await authApi.updateProfile(formData);

      // IMPORTANT: refresh auth context user instantly
      login(res.data.token, res.data.user);

      onClose();
    } catch (err) {
      console.error("PROFILE UPDATE ERROR:", err.message);
    }
  };

  // -------------------------
  // UI
  // -------------------------
  return (
    <Modal onClose={onClose}>
      <div className={styles.profileModal}>
        {/* HEADER */}
        <div className={styles.header}>
          <img
            src={user?.avatar || "src/assets/icons/user.png"}
            className={styles.avatar}
            alt="avatar"
          />

          <div>
            <h2>{user?.username}</h2>
            <p>
              {user?.profileComplete
                ? "Profile complete"
                : "Profile incomplete"}
            </p>
          </div>
        </div>

        {/* FORM */}
        <div className={styles.form}>
          <input
            name="fullName"
            placeholder="Full Name"
            value={form.fullName}
            onChange={handleChange}
          />

          <input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />

          <input
            name="mobileNumber"
            placeholder="Mobile Number"
            value={form.mobileNumber}
            onChange={handleChange}
          />

          <input
            name="age"
            placeholder="Age"
            value={form.age}
            onChange={handleChange}
          />

          {/* UPLOAD */}
          <div
            className={styles.uploadBox}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <p>
              Drag & drop or{" "}
              <span onClick={handleClickUpload}>upload avatar</span>
            </p>

            {form.avatar && (
              <p className={styles.fileName}>{form.avatar.name}</p>
            )}

            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              hidden
            />
          </div>

          {/* ACTIONS */}
          <button onClick={handleSave} className={styles.saveBtn}>
            Save
          </button>
        </div>
      </div>
    </Modal>
  );
}
