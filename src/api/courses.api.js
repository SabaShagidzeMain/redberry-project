import { api } from "./client";

export const coursesApi = {
  getCourses: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const url = query ? `/courses?${query}` : "/courses";

    return api.get(url);
  },
};
