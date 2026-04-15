import styles from "./Browse.module.css";
import { Link } from "react-router-dom";

export default function Browse() {
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
                <p>Development</p>
              </div>
              <div className={styles.tag}>
                <p>Design</p>
              </div>
              <div className={styles.tag}>
                <p>Business</p>
              </div>
              <div className={styles.tag}>
                <p>Data Science</p>
              </div>
              <div className={styles.tag}>
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
                <p>Marilyn Mango</p>
              </div>
              <div className={styles.tag}>
                <p>Ryan Dorwart</p>
              </div>
              <div className={styles.tag}>
                <p>Roger Calzoni</p>
              </div>
              <div className={styles.tag}>
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
