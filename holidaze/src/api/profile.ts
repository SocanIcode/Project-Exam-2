import { HOLIDAZE_BASE } from "../utils/constants";
import { apiFetch } from "./client";

type ApiResponse<T> = { data: T; meta: Record<string, unknown> };

export type UpdateProfilePayload = {
  avatar?: { url: string; alt?: string | null };
  banner?: { url: string; alt?: string | null };
};

export type ProfileResponse = {
  name: string;
  email: string;
  venueManager: boolean;
  avatar?: { url?: string; alt?: string };
  banner?: { url?: string; alt?: string };
};

export async function updateProfile(
  profileName: string,
  payload: UpdateProfilePayload,
): Promise<ProfileResponse> {
  const res = await apiFetch<ApiResponse<ProfileResponse>>(
    `${HOLIDAZE_BASE}/profiles/${profileName}`,
    {
      method: "PUT",
      body: JSON.stringify(payload),
    },
  );
  return res.data;
}

const API_KEY = import.meta.env.VITE_NOROFF_API_KEY;

export async function getProfile(name: string, token: string) {
  const res = await fetch(`${HOLIDAZE_BASE}/profiles/${name}`, {
    headers: {
      "Content-Type": "application/json",
      ...(API_KEY ? { "X-Noroff-API-Key": API_KEY } : {}),
      Authorization: `Bearer ${token}`,
    },
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(json?.errors?.[0]?.message || "Failed to load profile");
  }

  return json.data;
}
