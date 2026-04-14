import { useEffect, useState } from "react";
import { api } from "../api/client";

export default function Courses() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    api
      .get("/courses")
      .then((res) => setCourses(res.data))
      .catch(console.error);
  }, []);

  return (
    <div>
      <h1>Courses</h1>

      {courses.map((course) => (
        <div key={course.id}>
          <h3>{course.title}</h3>
        </div>
      ))}
    </div>
  );
}
