
const API_BASE_URL = "http://localhost:8080/api";
const USER_KEY = "shopsphere_user";

export type UserRole = "ADMIN" | "CUSTOMER";

export interface ShopSphereUser {
  id?: number;
  name?: string;
  email: string;
  role: UserRole;
  createdAt?: string;
}

interface AuthResponse {
  message?: string;
  user?: {
    id?: number;
    name?: string;
    email?: string;
    role?: string;
    createdAt?: string;
  };
}

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

async function readResponse(response: Response): Promise<AuthResponse> {
  const text = await response.text();
  let data: AuthResponse = {};

  if (text) {
    try {
      data = JSON.parse(text) as AuthResponse;
    } catch {
      throw new Error(`Unexpected backend response (${response.status}).`);
    }
  }

  if (!response.ok) {
    throw new Error(
      data.message || `Request failed with status ${response.status}.`
    );
  }

  return data;
}

function extractUser(data: AuthResponse): ShopSphereUser {
  const backendUser = data.user;

  if (!backendUser?.email) {
    throw new Error("The backend did not return the user's email.");
  }

  const role = backendUser.role
    ?.trim()
    .toUpperCase()
    .replace(/^ROLE_/, "");

  if (role !== "ADMIN" && role !== "CUSTOMER") {
    throw new Error(
      "The backend did not return a valid role. " +
      "Ensure the login response contains user.role as ADMIN or CUSTOMER."
    );
  }

  return {
    id: backendUser.id,
    name: backendUser.name,
    email: backendUser.email,
    role,
    createdAt: backendUser.createdAt,
  };
}

function saveUser(user: ShopSphereUser, rememberMe: boolean): void {
  const targetStorage = rememberMe ? localStorage : sessionStorage;
  const otherStorage = rememberMe ? sessionStorage : localStorage;

  targetStorage.setItem(USER_KEY, JSON.stringify(user));
  otherStorage.removeItem(USER_KEY);
}

export async function registerUser(
  request: RegisterRequest
): Promise<{ message: string }> {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: request.name.trim(),
      email: request.email.trim(),
      password: request.password,
    }),
  });

  const data = await readResponse(response);

  return {
    message: data.message || "Registration successful.",
  };
}

export async function loginUser(
  email: string,
  password: string,
  rememberMe = true
): Promise<ShopSphereUser> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email.trim(),
      password,
    }),
  });

  const data = await readResponse(response);
  const user = extractUser(data);

  saveUser(user, rememberMe);

  return user;
}

export function getCurrentUser(): ShopSphereUser | null {
  const savedUser =
    localStorage.getItem(USER_KEY) ??
    sessionStorage.getItem(USER_KEY);

  if (!savedUser) {
    return null;
  }

  try {
    const parsed = JSON.parse(savedUser) as Partial<ShopSphereUser>;
    const role = parsed.role
      ?.toUpperCase()
      .replace(/^ROLE_/, "");

    if (
      !parsed.email ||
      (role !== "ADMIN" && role !== "CUSTOMER")
    ) {
      logoutUser();
      return null;
    }

    return {
      id: parsed.id,
      name: parsed.name,
      email: parsed.email,
      role,
      createdAt: parsed.createdAt,
    };
  } catch {
    logoutUser();
    return null;
  }
}

export function isLoggedIn(): boolean {
  return getCurrentUser() !== null;
}

export function isAdmin(): boolean {
  return getCurrentUser()?.role === "ADMIN";
}

export function logoutUser(): void {
  localStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(USER_KEY);
}

/**
 * No JWT is currently issued by this project.
 * This function does not authenticate requests to protected backend APIs.
 */
export function getAuthToken(): null {
  return null;
}
