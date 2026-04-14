import styles from "./Navbar.module.css";

export default function Navbar() {
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
          <div className={styles.nav_tag}>
            <img src="src/assets/icons/book.png" alt="" />
            <p>Enrolled Courses</p>
          </div>
          <div className={styles.button_container}>
            <button className={styles.log_btn}>Login</button>
            <button className={styles.reg_btn}>Register</button>
          </div>
        </div>
      </div>
    </nav>
  );
}
