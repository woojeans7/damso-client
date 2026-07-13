export const DAMSO_ACCESS_TOKEN_KEY = "damso_access_token";
export const DAMSO_DEMO_MODE_KEY = "demoMode";

export function saveAccessToken(accessToken: string) {
  if (typeof window === "undefined") return;
  clearDemoMode();
  window.localStorage.setItem(DAMSO_ACCESS_TOKEN_KEY, accessToken);
}

export function getAccessToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(DAMSO_ACCESS_TOKEN_KEY);
}

export function clearAccessToken() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(DAMSO_ACCESS_TOKEN_KEY);
}

export function saveDemoMode() {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(DAMSO_DEMO_MODE_KEY, "true");
}

export function isDemoModeEnabled() {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(DAMSO_DEMO_MODE_KEY) === "true";
}

export function clearDemoMode() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(DAMSO_DEMO_MODE_KEY);
}

export function clearAuthSession() {
  clearAccessToken();
  clearDemoMode();
}
