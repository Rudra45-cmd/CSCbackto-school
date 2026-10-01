import { apiFetch } from "./api";

const TOKEN_KEY = "studysync_access_token";

export interface Student {
  id: number;
  name: string;
  email: string;
  grade: string;
  subjects: string[];
  daily_goal: string;
  preferred_study_time: string;
}

interface AuthResponse {
  message: string;
  user: Student;
  access_token: string;
  token_type: string;
}

interface MeResponse {
  user: Student;
}

export async function login(
  email: string,
  password: string,
): Promise<Student> {
  const response = await apiFetch<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
    }),
  });

  localStorage.setItem(TOKEN_KEY, response.access_token);

  return response.user;
}

export async function register(
  name: string,
  email: string,
  password: string,
  grade: string,
): Promise<Student> {
  const response = await apiFetch<AuthResponse>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({
      name,
      email,
      password,
      grade,
    }),
  });

  localStorage.setItem(TOKEN_KEY, response.access_token);

  return response.user;
}

export async function getCurrentUser(): Promise<Student> {
  const token = localStorage.getItem(TOKEN_KEY);

  if (!token) {
    throw new Error("Not authenticated");
  }

  return apiFetch<MeResponse>("/api/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((response) => response.user);
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function logout(): void {
  localStorage.removeItem(TOKEN_KEY);
}
