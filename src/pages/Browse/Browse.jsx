import styles from "./Browse.module.css";
import { Link } from "react-router-dom";
import LoadingScreen from "../../components/LoadingScreen/LoadingScreen";
import useBrowseData from "../../hooks/useBrowseData";
import { useState, useRef, useEffect } from "react";
import SortDropdown from "../../components/SortDropDown/SortDropDown";

import devIcon from "../../assets/categories/development.png";
import designIcon from "../../assets/categories/design.png";
import businessIcon from "../../assets/categories/business.png";
import dataIcon from "../../assets/categories/datasci.png";
import marketingIcon from "../../assets/categories/marketing.png";

export default function Browse() {
  const data = useBrowseData();

  const categoryIcons = {
    development: devIcon,
    design: designIcon,
    business: businessIcon,
    "data-science": dataIcon,
    marketing: marketingIcon,
  };

  const activeFilterCount =
    data.selectedCategories.length +
    data.selectedTopics.length +
    data.selectedInstructors.length;

  const visibleTopics =
    data.selectedCategories.length > 0
      ? data.topics.filter((t) =>
          data.selectedCategories.includes(t.categoryId),
        )
      : data.topics;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowSort(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
            <button onClick={data.clearFilters}>Clear all filters</button>
          </div>

          {/* CATEGORIES */}
          <div className={styles.tagContainer}>
            <div className={styles.tagHeader}>
              <p>Categories</p>
            </div>

            <div className={styles.tagWrapper}>
              {data.categories.map((cat) => (
                <div
                  key={cat.id}
                  className={`${styles.tag} ${
                    data.selectedCategories.includes(cat.id)
                      ? styles.activeTag
                      : ""
                  }`}
                  onClick={() => data.toggleCategory(cat.id)}
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
              {visibleTopics.map((topic) => (
                <div
                  key={topic.id}
                  className={`${styles.tag} ${
                    data.selectedTopics.includes(topic.id)
                      ? styles.activeTag
                      : ""
                  }`}
                  onClick={() => data.toggleTopic(topic.id)}
                >
                  <p>{topic.name}</p>
                </div>
              ))}
            </div>
          </div>

          {/* INSTRUCTORS */}
          <div className={styles.tagContainer}>
            <div className={styles.tagHeader}>
              <p>Instructors</p>
            </div>

            <div className={styles.instructorWrapper}>
              {data.instructors.map((ins) => (
                <div
                  key={ins.id}
                  className={`${styles.tag} ${
                    data.selectedInstructors.includes(ins.id)
                      ? styles.activeTag
                      : ""
                  }`}
                  onClick={() => data.toggleInstructor(ins.id)}
                >
                  <img
                    className={styles.instructor}
                    src={ins.avatar}
                    alt={ins.name}
                  />
                  <p>{ins.name}</p>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.activeFilters}>
            <span></span>
            <p>
              {activeFilterCount === 0
                ? "0 Filters Active"
                : `${activeFilterCount} Filters Active`}
            </p>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className={styles.cardPanel}>
          <div>
            <div className={styles.cardPanelTop}>
              <div className={styles.topText}>
                {data.courses.length === 0 ? (
                  <p>No courses found</p>
                ) : (
                  <p>
                    Showing {data.courses.length} out of{" "}
                    {data.meta?.total || "..."}
                  </p>
                )}
              </div>

              {/* SORT */}
              <SortDropdown
                sort={data.sort}
                setSort={data.setSort}
                options={[
                  "Newest first",
                  "Price: Low to high",
                  "Price: High to low",
                  "Most popular",
                  "Title: A-Z",
                ]}
              />
            </div>

            {/* COURSES */}
            {data.loading && <LoadingScreen text="Loading courses..." />}

            <div className={styles.grid}>
              {!data.loading &&
                data.courses.map((course) => (
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
                            src={
                              categoryIcons[course.category?.icon] || devIcon
                            }
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
                  </Link>
                ))}
            </div>
          </div>

          {/* PAGINATION */}
          <div className={styles.pagination}>
            <button
              className={`${styles.pageBtn} ${
                data.page === 1 ? styles.disabled : ""
              }`}
              onClick={() => data.setPage(data.page - 1)}
              disabled={data.page === 1}
            >
              ←
            </button>

            {data.meta &&
              Array.from({ length: data.meta.lastPage }, (_, i) => i + 1).map(
                (p) => (
                  <button
                    key={p}
                    onClick={() => data.setPage(p)}
                    className={`${styles.pageBtn} ${
                      p === data.page ? styles.activePage : ""
                    }`}
                  >
                    {p}
                  </button>
                ),
              )}

            <button
              className={`${styles.pageBtn} ${
                data.meta && data.page === data.meta.lastPage
                  ? styles.disabled
                  : ""
              }`}
              onClick={() => data.meta && data.setPage(data.page + 1)}
              disabled={data.meta && data.page === data.meta.lastPage}
            >
              →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
