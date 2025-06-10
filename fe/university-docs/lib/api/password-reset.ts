export const requestPasswordReset = async (email: string) => {
  const response = await fetch("/api/v1/password-reset/request-reset", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    throw new Error("Failed to request password reset");
  }

  return response.json();
}; 