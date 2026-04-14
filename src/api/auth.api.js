import { api } from "./client";

export const authApi = {
  register: (data) => api.post("/register", data),

  login: (data) => api.post("/login", data),

  me: () => api.get("/me"),

  logout: () => api.post("/logout"),
};
