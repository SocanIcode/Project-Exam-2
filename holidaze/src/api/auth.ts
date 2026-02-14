import { API_BASE } from "../utils/constants";

type LoginBody = { email: string; password: string };
type RegisterBody = {
  name: string;
  email: string;
  password: string;
  venueManager?: boolean;
};

const API_KEY = import.meta.env.VITE_NOROFF_API_KEY;

async function readJsonSafe(res: Response) {
  try {
    return await res.json();
  } catch {
    return {};
  }
}

export async function login(body: LoginBody) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(API_KEY ? { "X-Noroff-API-Key": API_KEY } : {}),
    },
    body: JSON.stringify(body),
  });

  const json = await readJsonSafe(res);

  if (!res.ok) {
    throw new Error(json?.errors?.[0]?.message || "Login failed");
  }

  return json.data;
}

export async function registerUser(body: RegisterBody) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(API_KEY ? { "X-Noroff-API-Key": API_KEY } : {}),
    },
    body: JSON.stringify(body),
  });

  const json = await readJsonSafe(res);

  if (!res.ok) {
    throw new Error(json?.errors?.[0]?.message || "Register failed");
  }

  return json.data;
}
