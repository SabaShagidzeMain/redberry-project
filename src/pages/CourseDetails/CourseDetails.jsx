import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { coursesApi } from "../../api/courses.api";
import styles from "./CourseDetails.module.css";

export default function CourseDetails() {
  const { id } = useParams();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  const [schedule, setSchedule] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);

        const res = await coursesApi.getCourseById(id);
        const data = res.data;

        setCourse(data);

        setSchedule(data.enrollment?.schedule || null);
      } catch (err) {
        console.error("❌ COURSE FETCH ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!course) return <p>Course not found</p>;

  return (
    <div className={styles.page}>
      <h1>{course.title}</h1>
    </div>
  );
}
