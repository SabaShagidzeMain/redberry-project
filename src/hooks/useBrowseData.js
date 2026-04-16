import { useEffect, useRef, useState } from "react";
import { coursesApi } from "../api/courses.api";
import { browseApi } from "../api/browse.api";

export default function useBrowseData() {
  const [courses, setCourses] = useState([]);
  const [meta, setMeta] = useState(null);

  const [categories, setCategories] = useState([]);
  const [topics, setTopics] = useState([]);
  const [instructors, setInstructors] = useState([]);

  const [loading, setLoading] = useState(true);
  const [silentLoading, setSilentLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("Newest first");

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [selectedInstructors, setSelectedInstructors] = useState([]);

  const isFirstRender = useRef(true);

  // ---------------------------
  // TOGGLES
  // ---------------------------
  const toggleCategory = (id) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const toggleTopic = (id) => {
    setSelectedTopics((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const toggleInstructor = (id) => {
    setSelectedInstructors((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedTopics([]);
    setSelectedInstructors([]);
    setPage(1);
  };

  // ---------------------------
  // FETCH DATA
  // ---------------------------
  const fetchData = async () => {
    try {
      if (isFirstRender.current) setLoading(true);
      else setSilentLoading(true);

      const [coursesRes, categoriesRes, topicsRes, instructorsRes] =
        await Promise.all([
          coursesApi.getCourses({ page, limit: 9 }),
          browseApi.getCategories(),
          browseApi.getTopics(),
          browseApi.getInstructors(),
        ]);

      let allCourses = coursesRes.data || [];

      if (selectedCategories.length) {
        allCourses = allCourses.filter((c) =>
          selectedCategories.includes(c.category?.id),
        );
      }

      if (selectedTopics.length) {
        allCourses = allCourses.filter((c) =>
          selectedTopics.includes(c.topic?.id),
        );
      }

      if (selectedInstructors.length) {
        allCourses = allCourses.filter((c) =>
          selectedInstructors.includes(c.instructor?.id),
        );
      }

      switch (sort) {
        case "Newest first":
          allCourses.sort((a, b) => b.id - a.id);
          break;
        case "Price: Low to high":
          allCourses.sort((a, b) => a.basePrice - b.basePrice);
          break;
        case "Price: High to low":
          allCourses.sort((a, b) => b.basePrice - a.basePrice);
          break;
        case "Most popular":
          allCourses.sort((a, b) => (b.avgRating || 0) - (a.avgRating || 0));
          break;
        case "Title: A-Z":
          allCourses.sort((a, b) => a.title.localeCompare(b.title));
          break;
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
      setSilentLoading(false);
      isFirstRender.current = false;
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, selectedCategories, selectedTopics, selectedInstructors, sort]);

  // ---------------------------
  // RETURN API
  // ---------------------------
  return {
    courses,
    meta,
    categories,
    topics,
    instructors,

    loading,
    silentLoading,

    page,
    setPage,

    sort,
    setSort,

    selectedCategories,
    selectedTopics,
    selectedInstructors,

    setSelectedCategories,
    setSelectedTopics,
    setSelectedInstructors,

    toggleCategory,
    toggleTopic,
    toggleInstructor,
    clearFilters,
  };
}
