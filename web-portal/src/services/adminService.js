const API_URL = `${import.meta.env.VITE_API_URL}/admin`;
const TOKEN_KEY = "webPortalAdminToken";

export function getAdminToken() {
  return sessionStorage.getItem(TOKEN_KEY);
}

export function setAdminToken(token) {
  sessionStorage.setItem(TOKEN_KEY, token);
}

export function clearAdminToken() {
  sessionStorage.removeItem(TOKEN_KEY);
}

function authHeaders() {
  const token = getAdminToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function parseResponse(response) {
  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(body.message || "Admin request failed.");
  }

  return body;
}

export async function loginAdmin(credentials) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  return parseResponse(response);
}

export async function getAdminProfile() {
  const response = await fetch(`${API_URL}/auth/me`, {
    headers: authHeaders(),
  });

  return parseResponse(response);
}

export async function fetchAdminStudents(params = {}) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value) searchParams.set(key, value);
  });

  const response = await fetch(`${API_URL}/students?${searchParams}`, {
    headers: authHeaders(),
  });

  return parseResponse(response);
}

export async function fetchAdminStudent(id) {
  const response = await fetch(`${API_URL}/students/${id}`, {
    headers: authHeaders(),
  });

  return parseResponse(response);
}

export async function updateStudentReview(id, payload) {
  const response = await fetch(`${API_URL}/students/${id}/review`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify(payload),
  });

  return parseResponse(response);
}

export async function uploadOfferLetter(id, file) {
  const formData = new FormData();
  formData.append("offerLetter", file);

  const response = await fetch(`${API_URL}/students/${id}/offer-letter`, {
    method: "POST",
    headers: authHeaders(),
    body: formData,
  });

  return parseResponse(response);
}
