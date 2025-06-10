export const getAuthToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
}; 

export const handleGoogleLogin = () => {
  const redirectUri = `${window.location.origin}/auth/google/callback`;
  window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google/login?redirect_uri=${encodeURIComponent(redirectUri)}`;
}; 