const API_BASE = `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api`;

const request = async (path, options = {}) => {
  const token = localStorage.getItem("intervexa_token");
  const isFormData = options.body instanceof FormData;
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      ...(!isFormData ? { "Content-Type": "application/json" } : {}),
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
  submitAnswer: (id, audioBlob) => {
    const formData = new FormData();
    formData.append("audio", audioBlob, "answer.webm");

    return request(`/interviews/${id}/answer`, {
      method: "POST",
      body: formData
    });
  },
  history: () => request("/interviews/history")
};

export const createAudioUrl = (audioBase64, mimeType = "audio/wav") => {
  if (!audioBase64) {
    return null;
  }

  const binary = atob(audioBase64);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  const blob = new Blob([bytes], { type: mimeType });
  return URL.createObjectURL(blob);
};
