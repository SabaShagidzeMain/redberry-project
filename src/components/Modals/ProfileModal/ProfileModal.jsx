import { useState, useRef, useEffect } from "react";
import Modal from "../../Modal/Modal";
import styles from "./ProfileModal.module.css";
import { useAuth } from "../../../context/AuthContext";
import { authApi } from "../../../api/auth.api";
import LoadingScreen from "../../LoadingScreen/LoadingScreen";

import upload from "../../../assets/icons/upload.png";

export default function ProfileModal({ onClose }) {
  const { user, login, token, logout } = useAuth();
  const [loading, setLoading] = useState(false);

  const [preview, setPreview] = useState(null);
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

    setPreview(URL.createObjectURL(file));
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

    setPreview(URL.createObjectURL(file));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleSave = async () => {
    setLoading(true);

    try {
      let res;

      if (form.avatar) {
        const formData = new FormData();

        formData.append("full_name", form.fullName);
        formData.append("email", form.email);
        formData.append("mobile_number", form.mobileNumber);
        formData.append("age", form.age);
        formData.append("avatar", form.avatar);

        res = await authApi.updateProfile(formData);
      } else {
        res = await authApi.updateProfile({
          full_name: form.fullName,
          email: form.email,
          mobile_number: form.mobileNumber,
          age: form.age,
        });
      }

      const updatedUser = res.data?.data || res.data;

      login(token, updatedUser);

      onClose();
      window.location.reload();
    } catch (err) {
      console.error("PROFILE UPDATE ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setLoading(true);

    setTimeout(() => {
      logout();
      onClose();
      window.location.reload();
    }, 400);
  };

  return (
    <Modal onClose={onClose}>
      {/* {loading && <LoadingScreen text="Updating profile..." />} */}
      <div className={styles.profileModal}>
        <div className={styles.heading}>
          <h2>Profile</h2>
        </div>

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
          <div className={styles.formSegment}>
            <p>Full Name</p>
            <input
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formSegment}>
            <p>Email</p>
            <input name="email" value={form.email} onChange={handleChange} />
          </div>

          <div className={styles.formDouble}>
            <div className={styles.formSegment}>
              <p>Mobile Number</p>
              <input
                name="mobileNumber"
                value={form.mobileNumber}
                onChange={handleChange}
              />
            </div>

            <div className={styles.formSegment}>
              <p>Age</p>
              <input name="age" value={form.age} onChange={handleChange} />
            </div>
          </div>

          <div
            className={styles.uploadBox}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            {preview ? (
              <div className={styles.preview}>
                <img src={preview} className={styles.previewImg} />
                {form.avatar && (
                  <p className={styles.fileName}>{form.avatar.name}</p>
                )}
              </div>
            ) : (
              <>
                <img src={upload} className={styles.regUploadIcon} />
                <p>
                  Drag & drop or{" "}
                  <span onClick={handleClickUpload}>upload avatar</span>
                </p>
              </>
            )}

            <input
              ref={fileInputRef}
              type="file"
              hidden
              onChange={handleFileChange}
            />
          </div>

          <button onClick={handleSave} className={styles.saveBtn}>
            Save
          </button>

          <button onClick={handleLogout} className={styles.logoutBtn}>
            Logout
          </button>
        </div>
      </div>
    </Modal>
  );
}
