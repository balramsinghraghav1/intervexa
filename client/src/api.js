const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const request = async (path, options = {}) => {
  const token = localStorage.getItem("intervexa_token");
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    },
    ...options
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};

export const api = {
  register: (payload) =>
    request("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  login: (payload) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  me: () => request("/auth/me"),
  overview: () => request("/dashboard/overview"),
  startInterview: (payload) =>
    request("/interviews/start", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  submitInterview: (id, payload) =>
    request(`/interviews/${id}/submit`, {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  history: () => request("/interviews/history")
};

