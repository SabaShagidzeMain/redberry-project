import styles from "./Browse.module.css";

export default function Browse() {
  return (
    <div className={styles.page}>
      <div className={styles.breadcrumbs}>Home &gt; Browse</div>

      {/* TOOLBAR */}
      <div className={styles.toolbar}>
        {/* LEFT: filters */}
        <div className={styles.filters}>
          <div>Categories</div>
          <div>Topics</div>
          <div>Instructors</div>

          <div className={styles.activeFilters}>3 active filters</div>
        </div>

        {/* RIGHT: course controls */}
        <div className={styles.controls}>
          <div>Showing 9 out of 90</div>

          <div className={styles.sort}>Sort by: Newest first &gt;</div>
        </div>
      </div>

      {/* COURSES */}
      <div className={styles.grid}>{/* Course cards go here */}</div>
    </div>
  );
}
