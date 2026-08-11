// Centralized environment-derived config

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

export const MEDIA_BASE_URL = API_BASE_URL.replace(/\/api\/?$/, "");

export function resolveMediaUrl(
  path: string | null | undefined,
): string | null {
  if (!path) return null;

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  return `${MEDIA_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}
