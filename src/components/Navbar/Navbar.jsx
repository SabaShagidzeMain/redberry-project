import styles from "./Navbar.module.css";
import LoginModal from "../Auth/Login/LoginModal";
import RegisterModal from "../Auth/Register/RegisterModal";
import ProfileModal from "../Auth/Profile/ProfileModal";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const { isAuthenticated, logout, user } = useAuth();

  return (
    <nav className={styles.nav}>
      <div className={styles.inner_nav}>
        <div className={styles.left}>
          <img src="src/assets/Logo.png" alt="" className={styles.logo} />
        </div>

        <div className={styles.right}>
          <div className={styles.nav_tag}>
            <img src="src/assets/icons/sparkles.png" alt="" />
            <p>Browse Courses</p>
          </div>

          {isAuthenticated && (
            <div className={styles.nav_tag}>
              <img src="src/assets/icons/book.png" alt="" />
              <p>Enrolled Courses</p>
            </div>
          )}

          <div className={styles.button_container}>
            {isAuthenticated ? (
              <div
                className={styles.avatarCircle}
                onClick={() => setShowProfile(true)}
              >
                <img
                  src={user?.avatar || "src/assets/icons/User.svg"}
                  alt="profile"
                  className={styles.avatarCircle}
                />
              </div>
            ) : (
              <>
                <button
                  className={styles.log_btn}
                  onClick={() => setShowLogin(true)}
                >
                  Login
                </button>

                <button
                  className={styles.reg_btn}
                  onClick={() => setShowRegister(true)}
                >
                  Register
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      {showRegister && <RegisterModal onClose={() => setShowRegister(false)} />}
      {showProfile && <ProfileModal onClose={() => setShowProfile(false)} />}
    </nav>
  );
}
