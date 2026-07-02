const API_URL = "http://localhost:5000/api/students";

export async function submitStudentRegistration(formData) {
  const response = await fetch(API_URL, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.message || "Unable to submit registration. Please try again.");
  }

  return response.json().catch(() => ({}));
}
