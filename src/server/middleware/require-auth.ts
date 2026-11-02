import { AppError } from "@/server/utils/errors";
import { authRepository } from "@/server/modules/auth/auth.repository";
import { getSessionUserId } from "@/server/modules/auth/session";

export async function requireAuth() {
  const userId = await getSessionUserId();
  if (!userId) {
    throw new AppError(401, "UNAUTHORIZED", "Please log in to continue");
  }

  const user = await authRepository.findPublicById(userId);
  if (!user) {
    throw new AppError(401, "UNAUTHORIZED", "Please log in to continue");
  }

  return user;
}