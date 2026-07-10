import { getAccessToken } from "@/lib/auth/token";

const API_BASE = "/api";
const MISSING_API_BASE_URL_MESSAGE = "NEXT_PUBLIC_API_BASE_URL 환경변수가 설정되지 않았습니다.";

interface ApiErrorOptions {
  body?: string;
  detail?: string;
  requestUrl?: string;
}

export class ApiError extends Error {
  status: number;
  body?: string;
  detail?: string;
  requestUrl?: string;

  constructor(status: number, message: string, options: ApiErrorOptions = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = options.body;
    this.detail = options.detail;
    this.requestUrl = options.requestUrl;
  }
}

export function getApiBaseUrl() {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!apiBaseUrl) {
    throw new Error(MISSING_API_BASE_URL_MESSAGE);
  }

  return apiBaseUrl.replace(/\/+$/, "");
}

export function buildApiRequestUrl(baseUrl: string, path: string) {
  const normalizedBaseUrl = baseUrl.replace(/\/+$/, "");
  const normalizedPath = path.replace(/^\/+/, "");

  return normalizedPath ? `${normalizedBaseUrl}/${normalizedPath}` : normalizedBaseUrl;
}

function readDetailFromBody(body: string) {
  if (!body) return undefined;

  try {
    const parsed = JSON.parse(body) as unknown;

    if (parsed && typeof parsed === "object") {
      const detail = (parsed as Record<string, unknown>).detail;
      return typeof detail === "string" && detail.length > 0 ? detail : undefined;
    }
  } catch {
    return undefined;
  }

  return undefined;
}

function logApiResponseError(requestUrl: string, status: number, body: string) {
  console.error("[API] Request failed", {
    requestUrl,
    status,
    responseBody: body,
  });
}

function createApiResponseError(requestUrl: string, status: number, statusText: string, body: string) {
  const detail = readDetailFromBody(body);
  const message = detail ?? (body || statusText || "API 요청에 실패했습니다.");

  return new ApiError(status, message, {
    body,
    detail,
    requestUrl,
  });
}

export async function parseApiJsonResponse<T>(res: Response, requestUrl: string): Promise<T> {
  if (res.status === 204) return undefined as T;

  const body = await res.text();

  if (!body) {
    console.error("[API] Empty JSON response body", {
      requestUrl,
      status: res.status,
    });

    throw new ApiError(res.status, "API 응답 body가 비어 있어 JSON으로 해석할 수 없습니다.", {
      requestUrl,
    });
  }

  try {
    return JSON.parse(body) as T;
  } catch {
    console.error("[API] Failed to parse JSON response", {
      requestUrl,
      status: res.status,
      responseBody: body,
    });

    throw new ApiError(res.status, "API 응답을 JSON으로 해석하지 못했습니다.", {
      body,
      requestUrl,
    });
  }
}

export async function throwApiErrorFromResponse(res: Response, requestUrl: string): Promise<never> {
  const body = await res.text().catch(() => "");

  logApiResponseError(requestUrl, res.status, body);
  throw createApiResponseError(requestUrl, res.status, res.statusText, body);
}

export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getAccessToken();
  const requestUrl = buildApiRequestUrl(API_BASE, path);

  let res: Response;

  try {
    res = await fetch(requestUrl, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...init.headers,
      },
    });
  } catch (error) {
    console.error("[API] Fetch failed", {
      requestUrl,
      error,
    });
    throw error;
  }

  if (!res.ok) {
    await throwApiErrorFromResponse(res, requestUrl);
  }

  return parseApiJsonResponse<T>(res, requestUrl);
}
