const API_URL = `${import.meta.env.VITE_API_URL}/students`;
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