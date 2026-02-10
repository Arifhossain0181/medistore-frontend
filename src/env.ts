export const env = {
  // prefer env var, fallback to deployed backend to avoid HTML responses during dev
  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_BACKEND_URL,
};
