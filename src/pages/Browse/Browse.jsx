import styles from "./Browse.module.css";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { coursesApi } from "../../api/courses.api";
import { browseApi } from "../../api/browse.api";

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

  const [categories, setCategories] = useState([]);
  const [topics, setTopics] = useState([]);
  const [instructors, setInstructors] = useState([]);

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [selectedInstructors, setSelectedInstructors] = useState([]);

  const categoryIcons = {
    development: devIcon,
    design: designIcon,
    business: businessIcon,
    "data-science": dataIcon,
    marketing: marketingIcon,
  };

  // click outside dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowSort(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // fetch + filter
  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);

        const [coursesRes, categoriesRes, topicsRes, instructorsRes] =
          await Promise.all([
            coursesApi.getCourses({ page, limit: 9 }),
            browseApi.getCategories(),
            browseApi.getTopics(),
            browseApi.getInstructors(),
          ]);

        let allCourses = coursesRes.data || [];

        // CATEGORY filter
        if (selectedCategories.length > 0) {
          allCourses = allCourses.filter((c) =>
            selectedCategories.includes(c.category?.id),
          );
        }

        // TOPIC filter
        if (selectedTopics.length > 0) {
          allCourses = allCourses.filter((c) =>
            selectedTopics.includes(c.topic?.id),
          );
        }

        // INSTRUCTOR filter
        if (selectedInstructors.length > 0) {
          allCourses = allCourses.filter((c) =>
            selectedInstructors.includes(c.instructor?.id),
          );
        }

        setCourses(allCourses.slice(0, 9));
        setMeta(coursesRes.meta || null);

        setCategories(categoriesRes.data || []);
        setTopics(topicsRes.data || []);
        setInstructors(instructorsRes.data || []);
      } catch (err) {
        console.error("❌ BROWSE FETCH ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [page, selectedCategories, selectedTopics, selectedInstructors]);

  return (
    <div className={styles.page}>
      {/* BREADCRUMBS */}
      <div className={styles.breadcrumbs}>
        <Link to="/" className={styles.wayHome}>
          Home
        </Link>
        &nbsp;&gt;&nbsp;<span>Browse</span>
      </div>

      <div className={styles.toolbar}>
        {/* LEFT FILTERS */}
        <div className={styles.filters}>
          <div className={styles.filtersHeader}>
            <h4>Filters</h4>
            <button
              onClick={() => {
                setSelectedCategories([]);
                setSelectedTopics([]);
                setSelectedInstructors([]);
                setPage(1);
              }}
            >
              Clear all filters
            </button>
          </div>

          {/* CATEGORIES */}
          <div className={styles.tagContainer}>
            <div className={styles.tagHeader}>
              <p>Categories</p>
            </div>

            <div className={styles.tagWrapper}>
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className={`${styles.tag} ${
                    selectedCategories.includes(cat.id) ? styles.activeTag : ""
                  }`}
                  onClick={() =>
                    setSelectedCategories((prev) =>
                      prev.includes(cat.id)
                        ? prev.filter((id) => id !== cat.id)
                        : [...prev, cat.id],
                    )
                  }
                >
                  <img
                    src={categoryIcons[cat.icon] || devIcon}
                    alt={cat.name}
                  />
                  <p>{cat.name}</p>
                </div>
              ))}
            </div>
          </div>

          {/* TOPICS */}
          <div className={styles.tagContainer}>
            <div className={styles.tagHeader}>
              <p>Topics</p>
            </div>

            <div className={styles.tagWrapper}>
              {topics.map((topic) => {
                const isActive = selectedTopics.includes(topic.id);

                return (
                  <div
                    key={topic.id}
                    className={`${styles.tag} ${
                      isActive ? styles.activeTag : ""
                    }`}
                    onClick={() =>
                      setSelectedTopics((prev) =>
                        prev.includes(topic.id)
                          ? prev.filter((id) => id !== topic.id)
                          : [...prev, topic.id],
                      )
                    }
                  >
                    <p>{topic.name}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* INSTRUCTORS */}
          <div className={styles.tagContainer}>
            <div className={styles.tagHeader}>
              <p>Instructors</p>
            </div>

            <div className={styles.instructorWrapper}>
              {instructors.map((ins) => {
                const isActive = selectedInstructors.includes(ins.id);

                return (
                  <div
                    key={ins.id}
                    className={`${styles.tag} ${
                      isActive ? styles.activeTag : ""
                    }`}
                    onClick={() =>
                      setSelectedInstructors((prev) =>
                        prev.includes(ins.id)
                          ? prev.filter((id) => id !== ins.id)
                          : [...prev, ins.id],
                      )
                    }
                  >
                    <img
                      className={styles.instructor}
                      src={ins.avatar}
                      alt={ins.name}
                    />
                    <p>{ins.name}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className={styles.activeFilters}>
            <span></span>
            <p>0 Filters Active</p>
          </div>
        </div>
        {/* RIGHT SIDE */}
        <div className={styles.cardPanel}>
          <div>
            <div className={styles.cardPanelTop}>
              <div className={styles.topText}>
                <p>
                  Showing {courses.length} out of {meta?.total || "..."}
                </p>
              </div>

              {/* SORT */}
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

            {/* COURSES GRID */}
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
                          src={categoryIcons[course.category?.icon] || devIcon}
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
                          ${Math.floor(Number(course.basePrice))}
                        </span>
                      </div>

                      <button className={styles.cardButton}>Details</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* PAGINATION */}
          <div className={styles.pagination}>
            {/* LEFT ARROW */}
            <button
              className={`${styles.pageBtn} ${page === 1 ? styles.disabled : ""}`}
              onClick={() => page > 1 && setPage(page - 1)}
              disabled={page === 1}
            >
              ←
            </button>

            {/* PAGE NUMBERS */}
            {meta &&
              Array.from({ length: meta.lastPage }, (_, i) => i + 1).map(
                (p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`${styles.pageBtn} ${
                      p === page ? styles.activePage : ""
                    }`}
                  >
                    {p}
                  </button>
                ),
              )}

            {/* RIGHT ARROW */}
            <button
              className={`${styles.pageBtn} ${
                meta && page === meta.lastPage ? styles.disabled : ""
              }`}
              onClick={() => meta && page < meta.lastPage && setPage(page + 1)}
              disabled={meta && page === meta.lastPage}
            >
              →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
