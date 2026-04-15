import { useState, useRef, useEffect } from "react";
import Modal from "../../Modal/Modal";
import styles from "./ProfileModal.module.css";
import { useAuth } from "../../../context/AuthContext";
import { authApi } from "../../../api/auth.api";

export default function ProfileModal({ onClose }) {
  const { user, login, token } = useAuth();

  // 🔥 DEBUG: modal lifecycle
  console.log("🔥 PROFILE MODAL OPENED");
  console.log("👤 CONTEXT USER:", user);
  console.log("🔑 TOKEN:", token);

  useEffect(() => {
    console.log("📦 ProfileModal mounted");
    console.log("📊 initial user snapshot:", user);
  }, []);

  useEffect(() => {
    console.log("🔄 USER UPDATED IN MODAL:", user);
  }, [user]);

  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    mobileNumber: "",
    age: "",
    avatar: null,
  });

  useEffect(() => {
    if (!user) return;

    setForm({
      fullName: user.fullName || "",
      email: user.email || "",
      mobileNumber: user.mobileNumber || "",
      age: user.age || "",
      avatar: null,
    });
  }, [user]);

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
    console.log("📁 FILE PICKED:", file);

    if (!file) return;

    setForm((prev) => ({
      ...prev,
      avatar: file,
    }));
  };

  const handleClickUpload = () => {
    console.log("🖱️ Upload click triggered");
    fileInputRef.current?.click();
  };

  const handleDrop = (e) => {
    e.preventDefault();

    const file = e.dataTransfer?.files?.[0];

    console.log("💥 DROP EVENT:", file);

    if (!file) return;

    setForm((prev) => ({
      ...prev,
      avatar: file,
    }));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    console.log("🔥 dragging over upload box");
  };

  // -------------------------
  // SAVE PROFILE
  // -------------------------
  const handleSave = async () => {
    try {
      console.log("🚀 SAVE CLICKED");
      console.log("📦 FORM STATE:", form);

      const formData = new FormData();

      formData.append("fullName", form.fullName);
      formData.append("email", form.email);
      formData.append("mobileNumber", form.mobileNumber);
      formData.append("age", form.age);

      if (form.avatar) {
        formData.append("avatar", form.avatar);
      }

      const res = await authApi.updateProfile(formData);

      console.log("🔥 PROFILE UPDATE RESPONSE:", res);

      const updatedUser = res.data?.data || res.data;

      console.log("👤 UPDATED USER:", updatedUser);

      login(token, updatedUser);

      onClose();
    } catch (err) {
      console.error("❌ PROFILE UPDATE ERROR:", err);
    }
  };

  return (
    <Modal onClose={onClose}>
      <div className={styles.profileModal}>
        <div className={styles.header}>
          <div className={styles.avatarWrapper}>
            <img
              src={user?.avatar || "src/assets/icons/user.png"}
              className={styles.avatar}
              alt="avatar"
            />
          </div>

          <div className={styles.userInfo}>
            <h2 className={styles.username}>
              {user?.username || "Unknown user"}
            </h2>

            <p className={styles.status}>
              {user?.profileComplete
                ? "Profile complete"
                : "Profile incomplete"}
            </p>
          </div>
        </div>

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

          <button onClick={handleSave} className={styles.saveBtn}>
            Save
          </button>
        </div>
      </div>
    </Modal>
  );
}
