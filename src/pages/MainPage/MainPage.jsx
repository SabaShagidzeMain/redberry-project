import { Link } from "react-router-dom";
import styles from "./MainPage.module.css";
import heroOne from "../../assets/hero/heroOne.png";
import heroTwo from "../../assets/hero/heroTwo.png";
import heroThree from "../../assets/hero/heroThree.png";
import carLeft from "../../assets/hero/carLeft.png";
import carRight from "../../assets/hero/carRight.png";
import blur from "../../assets/hero/blur.png";
import lock from "../../assets/hero/lock.png";

import devIcon from "../../assets/categories/development.png";
import designIcon from "../../assets/categories/design.png";
import businessIcon from "../../assets/categories/business.png";
import dataIcon from "../../assets/categories/datasci.png";
import marketingIcon from "../../assets/categories/marketing.png";

import { useEffect, useState } from "react";
import { coursesApi } from "../../api/courses.api";
import { enrollmentApi } from "../../api/enrollments.api";
import { authApi } from "../../api/auth.api";

export default function MainPage() {
  const [courses, setCourses] = useState([]);
  const [enrolled, setEnrolled] = useState([]);

  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [loadingEnrolled, setLoadingEnrolled] = useState(true);

  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const isLoggedIn = !!user;

  useEffect(() => {
    const fetchMe = async () => {
      try {
        setLoadingUser(true);

        const res = await authApi.me();
        const data = res.data?.data || res.data;

        setUser(data);
      } catch (err) {
        setUser(null);
      } finally {
        setLoadingUser(false);
      }
    };

    fetchMe();
  }, []);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoadingFeatured(true);

        const res = await coursesApi.getFeaturedCourses();
        const data = res.data?.data || res.data || [];

        setCourses(Array.isArray(data) ? data : []);
      } catch (err) {
        setCourses([]);
      } finally {
        setLoadingFeatured(false);
      }
    };

    fetchFeatured();
  }, []);

  useEffect(() => {
    const fetchEnrolled = async () => {
      if (loadingUser || !isLoggedIn) {
        return;
      }

      try {
        setLoadingEnrolled(true);

        const res = await enrollmentApi.getEnrollments();
        const data = res.data?.data || res.data || [];

        const enrolledCourses = data.slice(0, 3);
        setEnrolled(enrolledCourses);

        setEnrolled(enrolledCourses);
      } catch (err) {
        setEnrolled([]);
      } finally {
        setLoadingEnrolled(false);
      }
    };

    fetchEnrolled();
  }, [isLoggedIn, loadingUser]);

  const categoryIcons = {
    development: devIcon,
    design: designIcon,
    business: businessIcon,
    "data-science": dataIcon,
    marketing: marketingIcon,
  };

  const renderCard = (course) => (
    <Link
      key={course.id}
      to={`/course/${course.id}`}
      className={styles.cardLink}
    >
      <div className={styles.card}>
        <div className={styles.top}>
          <img src={course.image} className={styles.image} />

          <div className={styles.meta}>
            <div className={styles.metaLeft}>
              <span>{course.instructor?.name}</span>
              <span> / </span>
              <span>{course.durationWeeks} weeks</span>
            </div>

            <div className={styles.metaRight}>
              <span>⭐ {course.avgRating}</span>
            </div>
          </div>

          <h3>{course.title}</h3>

          <div className={styles.cardCategory}>
            <img
              src={categoryIcons[course.category?.icon] || devIcon}
              className={styles.categoryIcon}
            />
            <span>{course.category?.name}</span>
          </div>
        </div>

        <div className={styles.bottom}>
          <div className={styles.priceWrapper}>
            <span className={styles.starting}>Starting from</span>
            <span className={styles.price}>
              ${Math.floor(Number(course.basePrice))}
            </span>
          </div>

          <button className={styles.cardButton}>Details</button>
        </div>
      </div>
    </Link>
  );

  const renderEnrolledCard = (enrollment) => {
    const course = enrollment.course;
    const progress = enrollment.progress ?? 0;

    return (
      <Link
        key={enrollment.id}
        to={`/course/${course.id}`}
        className={styles.cardLink}
      >
        <div className={`${styles.card} ${styles.enrolledCard}`}>
          <div className={styles.smallCardTop}>
            <img src={course.image} className={styles.image} />

            <div className={styles.smallcardMetaWrapper}>
              <div className={styles.smallCardMeta}>
                <div className={styles.smallCardLeft}>
                  <span>{course.instructor?.name}</span>
                </div>
                <div className={styles.metaRight}>
                  <span>⭐ {course.avgRating}</span>
                </div>
              </div>

              <div>
                <h4>{course.title}</h4>
              </div>
            </div>
          </div>

          <div className={styles.smallCardBot}>
            <div className={styles.progressWrapper}>
              <p>Progress: {progress}%</p>

              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <button className={styles.smallCardButton}>View</button>
          </div>
        </div>
      </Link>
    );
  };

  return (
    <div className={styles.page}>
      <div className={styles.heroBanner}>
        <div
          className={styles.heroInner}
          style={{
            backgroundImage: `url(${heroThree})`,
            objectFit: "cover",
            objectPosition: "center",
          }}
        >
          <div className={styles.heroText}>
            <div className={styles.heroMainText}>
              <h1>Start learning something new today</h1>
              <p>
                Explore a wide range of expert-led courses in design,
                development, business, and more. Find the skills you need to
                grow your career and learn at your own pace.
              </p>
            </div>
            <button>Browse Courses</button>
          </div>

          <div className={styles.carouselWrapper}>
            <span className={styles.carouselSpan} />
            <span className={styles.carouselSpan} />
            <span className={styles.carouselSpan} />
          </div>

          <div className={styles.arrowWrapper}>
            <img src={carLeft} alt="" />
            <img src={carRight} alt="" />
          </div>
        </div>
      </div>

      {isLoggedIn && (
        <div className={styles.cardWrapper}>
          <h3>Your Learning</h3>

          {loadingEnrolled ? (
            <p>Loading...</p>
          ) : enrolled.length ? (
            <div className={styles.cardRow}>
              {enrolled.map(renderEnrolledCard)}
            </div>
          ) : (
            <p>No enrolled courses yet</p>
          )}
        </div>
      )}

      <div className={styles.cardWrapper}>
        <div className={styles.cardHeader}>
          <h3>Start Learning Today</h3>
          <p>Choose from our most popular courses and begin your journey</p>
        </div>

        <div className={styles.cardRow}>
          {loadingFeatured ? <p>Loading...</p> : courses.map(renderCard)}
        </div>
      </div>
    </div>
  );
}
