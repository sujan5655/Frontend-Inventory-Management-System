// Centralized environment-derived config

export const API_BASE_URL: string =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ??
  "http://127.0.0.1:8000/api";

// The backend serves media files (product images) from the host root,
// not under /api, so strip the /api suffix to build the media base URL.
export const MEDIA_BASE_URL: string = API_BASE_URL.replace(/\/api\/?$/, "");

export function resolveMediaUrl(
  path: string | null | undefined,
): string | null {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${MEDIA_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}
