import { requireAuth } from "@/server/middleware/require-auth";
import { handleError, ok } from "@/server/utils/api-response";

export async function GET() {
  try {
    const user = await requireAuth();
    return ok({ user });
  } catch (error) {
    return handleError(error);
  }
}