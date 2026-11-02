import { prisma } from "@/server/db/prisma";
import { handleError, ok } from "@/server/utils/api-response";
import { AppError } from "@/server/utils/errors";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return ok({ status: "ok", database: "connected" });
  } catch (error) {
    console.error("Health check failed:", error);
    return handleError(new AppError(503, "DB_UNAVAILABLE", "Database is not reachable"));
  }
}