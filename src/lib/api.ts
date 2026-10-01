const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000";

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `API request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export interface HealthResponse {
  status: string;
  service: string;
}

export function checkBackend() {
  return apiFetch<HealthResponse>("/api/health");
}
