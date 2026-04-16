import { api } from "./client";

export const enrollmentApi = {
  createEnrollment: (data) => {
    console.log("🔥 ENROLL API REQUEST:", data);
    return api.post("/enrollments", data);
  },

  getEnrollments: () => {
    console.log("📦 FETCH ENROLLMENTS");
    return api.get("/enrollments");
  },
};
