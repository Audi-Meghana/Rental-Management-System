const defaultApiUrl = import.meta.env.DEV
  ? "http://localhost:5123/api"
  : "https://myhome-backend-icrx.onrender.com/api";

const configuredApiUrl = (import.meta.env.VITE_API_URL || defaultApiUrl)
  .trim()
  .replace(/\/+$/, "");

export const API_BASE_URL = /\/api$/i.test(configuredApiUrl)
  ? configuredApiUrl
  : `${configuredApiUrl}/api`;

export const API_ORIGIN = new URL(API_BASE_URL).origin;
