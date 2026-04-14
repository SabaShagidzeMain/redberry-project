const BASE_URL = "https://api.redclass.redberryinternship.ge/api";

const getToken = () => localStorage.getItem("token");

async function request(endpoint, method = "GET", body) {
  const token = getToken();

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "API Error");
  }

  const data = await res.json();
  return data;
}

// Helper methods
export const api = {
  get: (url) => request(url, "GET"),
  post: (url, body) => request(url, "POST", body),
  patch: (url, body) => request(url, "PATCH", body),
  delete: (url) => request(url, "DELETE"),
};

console.log("API client loaded");