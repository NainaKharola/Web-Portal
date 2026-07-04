const API_URL = "https://web-portal-l7kv.onrender.com/api/students";

export async function submitStudentRegistration(formData) {
  const response = await fetch(API_URL, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(
      errorBody.message || "Unable to submit registration."
    );
  }

  return response.json();
}