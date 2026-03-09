// 1. Remove the dependency on the env variable
const API = ""; 

export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export function setToken(token: string) {
  localStorage.setItem("token", token);
}

export function clearToken() {
  localStorage.removeItem("token");
}

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();

  // 2. Ensure the path starts with /api if it doesn't already
  const url = path.startsWith('/api') ? path : `/api${path}`;

  const res = await fetch(url, { // 3. Use the relative URL
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.error ?? "Request failed");
  return data as T;
}