import styles from "./FiltersPanel.module.css";

export default function FiltersPanel({
  categories,
  topics,
  instructors,
  selectedCategories,
  selectedTopics,
  selectedInstructors,
  toggleCategory,
  toggleTopic,
  toggleInstructor,
  clearFilters,
  activeFilterCount,
  visibleTopics,
  categoryIcons,
}) {
  return (
    <div className={styles.filters}>
      <div className={styles.filtersHeader}>
        <h4>Filters</h4>
        <button onClick={clearFilters}>Clear all filters</button>
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
              onClick={() => toggleCategory(cat.id)}
            >
              <img src={categoryIcons[cat.icon]} alt={cat.name} />
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
                selectedTopics.includes(topic.id) ? styles.activeTag : ""
              }`}
              onClick={() => toggleTopic(topic.id)}
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
          {instructors.map((ins) => (
            <div
              key={ins.id}
              className={`${styles.tag} ${
                selectedInstructors.includes(ins.id) ? styles.activeTag : ""
              }`}
              onClick={() => toggleInstructor(ins.id)}
            >
              <img src={ins.avatar} alt={ins.name} />
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
  );
}
