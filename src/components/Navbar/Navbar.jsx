import styles from "./Navbar.module.css";
import LoginModal from "../Modals/LoginModal/LoginModal";
import RegisterModal from "../Modals/RegisterModal/RegisterModal";
import ProfileModal from "../Modals/ProfileModal/ProfileModal";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import sparkles from "../../assets/icons/sparkles.png";
import book from "../../assets/icons/book.png";
import EnrollmentsDrawer from "../Drawer/EnrollmentsDrawer";

export default function Navbar() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showEnrollments, setShowEnrollments] = useState(false);

  const { isAuthenticated, logout, user } = useAuth();

  return (
    <nav className={styles.nav}>
      <div className={styles.inner_nav}>
        <div className={styles.left}>
          <Link to="/">
            <img src={logo} alt="" className={styles.logo} />
          </Link>
        </div>

        <div className={styles.right}>
          <div>
            <Link to="/browse" className={styles.nav_tag}>
              <img src={sparkles} alt="" />
              <p>Browse Courses</p>
            </Link>
          </div>

          {isAuthenticated && (
            <div
              className={styles.nav_tag}
              onClick={() => setShowEnrollments(true)}
            >
              <img src={book} alt="" />
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

      <EnrollmentsDrawer
        open={showEnrollments}
        onClose={() => setShowEnrollments(false)}
      />

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      {showRegister && <RegisterModal onClose={() => setShowRegister(false)} />}
      {showProfile && <ProfileModal onClose={() => setShowProfile(false)} />}
    </nav>
  );
}
