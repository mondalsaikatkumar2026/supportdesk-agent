import { ApiClientError } from "@/services/api-client";

export type RejectValue = { code: string; message: string };

function describe(error: ApiClientError) {
  if (error.code === "VALIDATION_ERROR" && Array.isArray(error.details)) {
    const parts = (error.details as Array<{ field?: string; message?: string }>)
      .map((d) => (d.field ? `${d.field}: ${d.message}` : d.message))
      .filter(Boolean);
    if (parts.length) return parts.join(". ");
  }
  return error.message;
}

export function toRejectValue(error: unknown): RejectValue {
  if (error instanceof ApiClientError) {
    return { code: error.code, message: describe(error) };
  }
  return { code: "UNKNOWN_ERROR", message: "Something went wrong. Please try again." };
}