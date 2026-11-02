import { loginSchema } from "@/server/modules/auth/auth.schema";
import { authService } from "@/server/modules/auth/auth.service";
import { createSessionToken, setSessionCookie } from "@/server/modules/auth/session";
import { handleError, ok, readJson } from "@/server/utils/api-response";

export async function POST(request: Request) {
  try {
    const input = loginSchema.parse(await readJson(request));
    const user = await authService.login(input);
    await setSessionCookie(await createSessionToken(user.id));
    return ok({ user });
  } catch (error) {
    return handleError(error);
  }
}