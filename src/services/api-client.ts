export class ApiClientError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status: number,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "ApiClientError";
  }
}

export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`/api${path}`, {
      ...init,
      headers: { "Content-Type": "application/json", ...init.headers },
      credentials: "same-origin",
    });
  } catch {
    throw new ApiClientError("NETWORK_ERROR", "Cannot reach the server. Check your connection.", 0);
  }

  let body: { success?: boolean; data?: T; error?: { code?: string; message?: string; details?: unknown } } | null =
    null;
  try {
    body = await response.json();
  } catch {
    body = null;
  }

  if (!response.ok || !body?.success) {
    throw new ApiClientError(
      body?.error?.code ?? "UNKNOWN_ERROR",
      body?.error?.message ?? "Request failed",
      response.status,
      body?.error?.details,
    );
  }

  return body.data as T;
}