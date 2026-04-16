import { api } from "./client";

export const enrollmentApi = {
  createEnrollment: (data) => {
    return api.post("/enrollments", data);
  },

  getEnrollments: () => {
    return api.get("/enrollments");
  },

  completeEnrollment: (id) => {
    return api.patch(`/enrollments/${id}/complete`);
  },
};
