import { useEffect, useRef, useState } from "react";
import styles from "./SortDropDown.module.css";

export default function SortDropdown({ sort, setSort, options }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const toggle = () => setOpen((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={styles.sortWrapper} ref={ref}>
      <div className={styles.sort} onClick={toggle}>
        <p>
          Sort by: <span>{sort}</span>
        </p>
        <img src="src/assets/categories/dropdown.png" alt="" />
      </div>

      {open && (
        <div className={styles.dropdown}>
          {options.map((option) => (
            <div
              key={option}
              className={styles.dropdownItem}
              onClick={() => {
                setSort(option);
                setOpen(false);
              }}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
