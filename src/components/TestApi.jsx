import { useEffect } from "react";
import { api } from "../api/client";

export default function TestApi() {
  useEffect(() => {
    api
      .get("/courses")
      .then((res) => {
        console.log("COURSES RESPONSE:", res);
      })
      .catch((err) => {
        console.error("API ERROR:", err.message);
      });
  }, []);

  return <div>Testing API...</div>;
}
