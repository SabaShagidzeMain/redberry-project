import { api } from "./client";

export const coursesApi = {
  getCourses: (params = {}) => {
    const query = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => query.append(key, v));
      } else if (value !== undefined && value !== null) {
        query.append(key, value);
      }
    });

    const url = query.toString() ? `/courses?${query.toString()}` : "/courses";

    return api.get(url);
  },
  getCourseById: (id) => {
    return api.get(`/courses/${id}`);
  },
};
