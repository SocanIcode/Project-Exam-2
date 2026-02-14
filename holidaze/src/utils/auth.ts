import { setUser as save, getUser as load, clearUser } from "./storage";

const USER_KEY = "holidaze_user";

export type AuthUser = {
  name: string;
  email: string;
  venueManager: boolean;
  accessToken: string;
  avatar?: { url?: string; alt?: string };
  banner?: { url?: string; alt?: string };
};

export function setAuth(user: AuthUser) {
  save(USER_KEY, user);
}

export function getAuthUser<T = AuthUser>(): T | null {
  return load<T>(USER_KEY);
}

export const getUser = getAuthUser;

export function clearAuth() {
  clearUser(USER_KEY);
}

export function isLoggedIn(): boolean {
  return Boolean(getAuthUser<AuthUser>()?.accessToken);
}

export function isVenueManager(): boolean {
  return Boolean(getAuthUser<AuthUser>()?.venueManager);
}
