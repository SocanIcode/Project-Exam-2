import { getUser } from "../utils/auth";

const API_KEY = import.meta.env.VITE_NOROFF_API_KEY as string | undefined;

export async function apiFetch<T>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
  const user = getUser<{ accessToken?: string }>();
  const token = user?.accessToken;

  const headers = new Headers(options.headers);

  //  set content-type when sending body
  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (API_KEY && !headers.has("X-Noroff-API-Key")) {
    headers.set("X-Noroff-API-Key", API_KEY);
  }

  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(url, { ...options, headers });

  if (res.status === 204) return undefined as T;

  const text = await res.text();
  const json = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const msg = json?.errors?.[0]?.message ?? `API error ${res.status}`;
    throw new Error(msg);
  }

  return json as T;
}
