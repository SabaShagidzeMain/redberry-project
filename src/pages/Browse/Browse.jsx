import styles from "./Browse.module.css";
import { Link } from "react-router-dom";
import LoadingScreen from "../../components/LoadingScreen/LoadingScreen";
import useBrowseData from "../../hooks/useBrowseData";
import SortDropdown from "../../components/SortDropDown/SortDropDown";
import FiltersPanel from "../../components/FiltersPanel/FiltersPanel";
import { sortOptions } from "../../utils/sortOptions";
import { categoryIcons } from "../../utils/categoryIcons";

export default function Browse() {
  const data = useBrowseData();

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
        <FiltersPanel
          categories={data.categories}
          topics={data.topics}
          instructors={data.instructors}
          selectedCategories={data.selectedCategories}
          selectedTopics={data.selectedTopics}
          selectedInstructors={data.selectedInstructors}
          toggleCategory={data.toggleCategory}
          toggleTopic={data.toggleTopic}
          toggleInstructor={data.toggleInstructor}
          clearFilters={data.clearFilters}
          activeFilterCount={activeFilterCount}
          visibleTopics={visibleTopics}
          categoryIcons={categoryIcons}
        />

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
                options={sortOptions}
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
