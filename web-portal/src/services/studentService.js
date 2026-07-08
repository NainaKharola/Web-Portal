const API_URL = `${import.meta.env.VITE_API_URL}/students`;

async function parseResponse(response) {
  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(body.message || "Student request failed.");
  }

  return body;
}

export async function submitStudentRegistration(formData) {
  const response = await fetch(API_URL, {
    method: "POST",
    body: formData,
  });

  return parseResponse(response);
}

export async function loginStudent(credentials) {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  return parseResponse(response);
}

export async function fetchStudentDashboard(credentials) {
  const params = new URLSearchParams(credentials);
  const response = await fetch(`${API_URL}/dashboard?${params}`);

  return parseResponse(response);
}

export function studentDocumentUrl(type, credentials) {
  const params = new URLSearchParams(credentials);
  return `${API_URL}/documents/${type}?${params}`;
}

export async function uploadCompletedDocuments(credentials, file) {
  const formData = new FormData();
  formData.append("email", credentials.email);
  formData.append("referenceId", credentials.referenceId);
  formData.append("completedDocuments", file);

  const response = await fetch(`${API_URL}/completed-documents`, {
    method: "POST",
    body: formData,
  });

  return parseResponse(response);
}
