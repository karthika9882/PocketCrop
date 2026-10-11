const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5173";

export type User = {
  id: number;
  name: string;
  email: string;
  preferred_language: string;
  onboarding_completed: boolean;
};

type AuthResponse = {
  access_token: string;
  token_type: string;
  user: User;
};

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...options.headers }
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(typeof data.detail === "string" ? data.detail : "Request failed. Check the API server.");
  }
  return data as T;
}

export function register(name: string, email: string, password: string) {
  return request<AuthResponse>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password })
  });
}

export function login(email: string, password: string) {
  return request<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password })
  });
}

export function getMe(token: string) {
  return request<User>("/api/auth/me", {
    headers: { Authorization: `Bearer ${token}` }
  });
}
