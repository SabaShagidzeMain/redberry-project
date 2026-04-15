import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.footerTop}>
          <div className={styles.footerBrand}>
            <div className={styles.brandLogo}>
              <img src="src/assets/Logo.png" alt="" />
              <h2>BootCamp</h2>
            </div>
            <div>
              <p>
                Your learning journey starts here! <br />
                Browse courses to get started
              </p>
            </div>
            <div className={styles.socialsWrapper}>
              <img
                src="src/assets/socials/Facebook.png"
                alt=""
                className={styles.fbIcon}
              />
              <img src="src/assets/socials/Twitter.png" alt="" />
              <img src="src/assets/socials/Instagram.png" alt="" />
              <img src="src/assets/socials/LinkedIn.png" alt="" />
              <img
                src="src/assets/socials/YouTube.png"
                alt=""
                className={styles.ytIcon}
              />
            </div>
          </div>
          <div className={styles.footerList}>
            <div className={styles.list}>
              <h4>Explore</h4>
              <ul>
                <li>
                  <a href="#">Enrolled Courses</a>
                </li>
                <li>
                  <a href="#">Browse Courses</a>
                </li>
              </ul>
            </div>
            <div className={styles.list}>
              <h4>Account</h4>
              <ul>
                <li>
                  <a href="#">Enrolled Courses</a>
                </li>
                <li>
                  <a href="#">Browse Courses</a>
                </li>
              </ul>
            </div>
            <div className={styles.list}>
              <h4>Contact</h4>
              <ul>
                <li>
                  <img src="src/assets/contact/mail.png" alt="" />
                  <a href="#">contact@company.com</a>
                </li>
                <li>
                  <img src="src/assets/contact/mobile.png" alt="" />
                  <a href="#">(+995) 555 111 222</a>
                </li>
                <li>
                  <img src="src/assets/contact/location.png" alt="" />
                  <a href="#">Aghmashenebeli St.115</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className={styles.footerBot}>
          <div className={styles.botLeft}>
            <p>Copyright © 2026 Redberry International</p>
          </div>
          <div className={styles.botRight}>
            <p>All Rights Reserved | Terms and Conditions | Privacy Policy</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
