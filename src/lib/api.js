const envApiUrl = process.env.NEXT_PUBLIC_API_URL || "";
const envIsLocalhost = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(envApiUrl);

export const API_BASE_URL = typeof window !== "undefined"
  ? envApiUrl && !envIsLocalhost
    ? envApiUrl
    : `${window.location.protocol}//${window.location.hostname}:3001`
  : envApiUrl || "http://localhost:3001";
