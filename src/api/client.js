import { getToken } from "../utils/auth";

const BASE_URL = "https://api.redclass.redberryinternship.ge/api";

async function request(endpoint, method = "GET", body) {
  const token = getToken();
  const isFormData = body instanceof FormData;

  const options = {
    method,
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
    },
  };

  // only attach body if it exists and method allows it
  if (body) {
    options.body = isFormData ? body : JSON.stringify(body);
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, options);

  let data;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    throw new Error(data?.message || "API Error");
  }

  return data;
}

export const api = {
  get: (url) => request(url, "GET"),

  post: (url, body) => request(url, "POST", body),

  patch: (url, body) => request(url, "PATCH", body),

  put: (url, body) => request(url, "PUT", body),

  delete: (url) => request(url, "DELETE"),
};
