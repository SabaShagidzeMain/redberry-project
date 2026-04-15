import { api } from "./client";

export const browseApi = {
  getCourses: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/courses${query ? `?${query}` : ""}`);
  },

  getCategories: () => api.get("/categories"),
  getTopics: () => api.get("/topics"),
  getInstructors: () => api.get("/instructors"),
};
