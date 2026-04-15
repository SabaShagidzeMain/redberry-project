import styles from "./Browse.module.css";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { coursesApi } from "../../api/courses.api";
import devIcon from "../../assets/categories/development.png";
import designIcon from "../../assets/categories/design.png";
import businessIcon from "../../assets/categories/business.png";
import dataIcon from "../../assets/categories/datasci.png";
import marketingIcon from "../../assets/categories/marketing.png";

export default function Browse() {
  const [showSort, setShowSort] = useState(false);
  const [sort, setSort] = useState("Newest first");
  const dropdownRef = useRef(null);
  const [courses, setCourses] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowSort(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);

        const res = await coursesApi.getCourses({
          page,
        });

        const allCourses = res.data || [];

        // ✅ FORCE 9 ITEMS PER PAGE (frontend-controlled pagination)
        const paginatedCourses = allCourses.slice(0, 9);

        setCourses(paginatedCourses);

        // ⚠️ meta still comes from backend (likely assumes 10/page)
        setMeta(res.meta || null);
      } catch (err) {
        console.error("❌ COURSES ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [page]);

  const categoryIcons = {
    development: devIcon,
    design: designIcon,
    business: businessIcon,
    "data-science": dataIcon,
    marketing: marketingIcon,
  };

  return (
    <div className={styles.page}>
      <div className={styles.breadcrumbs}>
        <Link to="/" className={styles.wayHome}>
          Home
        </Link>{" "}
        &gt; <span>Browse</span>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.filters}>
          <div className={styles.filtersHeader}>
            <h4>Filters</h4>
            <button>Clear all filters</button>
          </div>
          <div className={styles.tagContainer}>
            <div className={styles.tagHeader}>
              <p>Categories</p>
            </div>
            <div className={styles.tagWrapper}>
              <div className={styles.tag}>
                <img
                  src="src/assets/categories/development.png"
                  className={styles.instructor}
                  alt=""
                />
                <p>Development</p>
              </div>
              <div className={styles.tag}>
                <img
                  src="src/assets/categories/design.png"
                  className={styles.instructor}
                  alt=""
                />
                <p>Design</p>
              </div>
              <div className={styles.tag}>
                <img
                  src="src/assets/categories/business.png"
                  className={styles.instructor}
                  alt=""
                />
                <p>Business</p>
              </div>
              <div className={styles.tag}>
                <img
                  src="src/assets/categories/datasci.png"
                  className={styles.instructor}
                  alt=""
                />
                <p>Data Science</p>
              </div>
              <div className={styles.tag}>
                <img
                  src="src/assets/categories/marketing.png"
                  className={styles.instructor}
                  alt=""
                />
                <p>Marketing</p>
              </div>
            </div>
          </div>
          <div className={styles.tagContainer}>
            <div className={styles.tagHeader}>
              <p>Topics</p>
            </div>
            <div className={styles.tagWrapper}>
              <div className={styles.tag}>
                <p>React</p>
              </div>
              <div className={styles.tag}>
                <p>TypeScript</p>
              </div>
              <div className={styles.tag}>
                <p>Phython</p>
              </div>
              <div className={styles.tag}>
                <p>UX/UI</p>
              </div>
              <div className={styles.tag}>
                <p>Figma</p>
              </div>
              <div className={styles.tag}>
                <p>JavaScript</p>
              </div>
              <div className={styles.tag}>
                <p>Node.js</p>
              </div>
              <div className={styles.tag}>
                <p>Machine Learning</p>
              </div>
              <div className={styles.tag}>
                <p>SEO</p>
              </div>
              <div className={styles.tag}>
                <p>Analytics</p>
              </div>
            </div>
          </div>

          <div className={styles.tagContainer}>
            <div className={styles.tagHeader}>
              <p>Instructor</p>
            </div>
            <div className={styles.instructorWrapper}>
              <div className={styles.tag}>
                <img
                  src="src/assets/Instructors/Marilyn.png"
                  className={styles.instructor}
                  alt=""
                />
                <p>Marilyn Mango</p>
              </div>
              <div className={styles.tag}>
                <img
                  src="src/assets/Instructors/Ryan.png"
                  className={styles.instructor}
                  alt=""
                />
                <p>Ryan Dorwart</p>
              </div>
              <div className={styles.tag}>
                <img
                  src="src/assets/Instructors/Roger.png"
                  className={styles.instructor}
                  alt=""
                />
                <p>Roger Calzoni</p>
              </div>
              <div className={styles.tag}>
                <img
                  src="src/assets/Instructors/Zain.png"
                  className={styles.instructor}
                  alt=""
                />
                <p>Zain Philips</p>
              </div>
            </div>
          </div>

          <div className={styles.activeFilters}>
            <span></span>
            <p>0 Filters Active</p>
          </div>
        </div>

        {/* RIGHT: course controls */}
        <div className={styles.cardPanel}>
          <div className={styles.cardPanelTop}>
            <div className={styles.topText}>
              <p>Showing 9 out of 90</p>
            </div>
            <div className={styles.sortWrapper} ref={dropdownRef}>
              <div
                className={styles.sort}
                onClick={() => setShowSort((prev) => !prev)}
              >
                <p>
                  Sort by: <span>{sort}</span>
                </p>
                <img src="src/assets/categories/dropdown.png" alt="" />
              </div>

              {showSort && (
                <div className={styles.dropdown}>
                  {[
                    "Newest first",
                    "Price: Low to high",
                    "Price: High to low",
                    "Most popular",
                    "Title: A-Z",
                  ].map((option) => (
                    <div
                      key={option}
                      className={styles.dropdownItem}
                      onClick={() => {
                        setSort(option);
                        setShowSort(false);
                      }}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          {/* COURSES */}
          <div className={styles.grid}>
            {loading ? (
              <p>Loading...</p>
            ) : (
              courses.map((course) => (
                <div key={course.id} className={styles.card}>
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
                        src={categoryIcons[course.category?.icon]}
                        alt={course.category?.name}
                        className={styles.categoryIcon}
                      />
                      <span>{course.category?.name}</span>
                    </div>
                  </div>

                  <div className={styles.bottom}>
                    <div className={styles.priceWrapper}>
                      <span className={styles.starting}>Starting from</span>
                      <span className={styles.price}>
                        {" "}
                        ${Math.floor(Number(course.basePrice))}
                      </span>
                    </div>
                    <button className={styles.cardButton}>Details</button>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className={styles.pagination}>
            {meta &&
              Array.from({ length: meta.lastPage }, (_, i) => i + 1).map(
                (p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={p === page ? styles.activePage : ""}
                  >
                    {p}
                  </button>
                ),
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
