import { clearSessionCookie } from "@/server/modules/auth/session";
import { handleError, ok } from "@/server/utils/api-response";

export async function POST() {
  try {
    await clearSessionCookie();
    return ok({ loggedOut: true });
  } catch (error) {
    return handleError(error);
  }
}