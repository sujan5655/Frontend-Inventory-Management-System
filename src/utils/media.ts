const API_BASE_URL = "http://127.0.0.1:8000";

export function resolveMediaUrl(url?: string | null): string {
  if (!url) return "";

  if (url.startsWith("http")) {
    return url;
  }

  return `${API_BASE_URL}${url}`;
}
