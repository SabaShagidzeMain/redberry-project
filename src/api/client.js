import { getToken } from "../utils/auth";

const BASE_URL = "https://api.redclass.redberryinternship.ge/api";

async function request(endpoint, method = "GET", body) {
  const token = getToken();

  const isFormData = body instanceof FormData;

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(!isFormData && { "Content-Type": "application/json" }),
    },
    body: isFormData ? body : body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "API Error");
  }

  return res.json();
}

export const api = {
  get: (url) => request(url, "GET"),
  post: (url, body) => request(url, "POST", body),
  patch: (url, body) => request(url, "PATCH", body),
  delete: (url) => request(url, "DELETE"),
};
