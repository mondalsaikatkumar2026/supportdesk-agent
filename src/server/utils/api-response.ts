import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { AppError } from "./errors";

export function ok<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export async function readJson(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    throw new AppError(400, "INVALID_JSON", "Request body must be valid JSON");
  }
}

export function handleError(error: unknown) {
  if (error instanceof AppError) {
    return NextResponse.json(
      {
        success: false,
        error: { code: error.code, message: error.message, details: error.details },
      },
      { status: error.statusCode },
    );
  }

  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid request data",
          details: error.issues.map((i) => ({
            field: i.path.join("."),
            message: i.message,
          })),
        },
      },
      { status: 400 },
    );
  }

  console.error("Unhandled error:", error);
  return NextResponse.json(
    { success: false, error: { code: "INTERNAL_ERROR", message: "Something went wrong" } },
    { status: 500 },
  );
}