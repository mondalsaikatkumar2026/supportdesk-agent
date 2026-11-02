import bcrypt from "bcryptjs";
import { AppError } from "@/server/utils/errors";
import { authRepository } from "./auth.repository";
import type { LoginInput, RegisterInput } from "./auth.schema";

const SALT_ROUNDS = 12;

function isUniqueViolation(error: unknown) {
  return typeof error === "object" && error !== null && "code" in error && error.code === "P2002";
}

export const authService = {
  async register(input: RegisterInput) {
    const existing = await authRepository.findByEmail(input.email);
    if (existing) {
      throw new AppError(409, "EMAIL_TAKEN", "An account with this email already exists");
    }

    const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);

    try {
      return await authRepository.create({
        name: input.name,
        email: input.email,
        passwordHash,
      });
    } catch (error) {
      // Two simultaneous requests can both pass the check above.
      if (isUniqueViolation(error)) {
        throw new AppError(409, "EMAIL_TAKEN", "An account with this email already exists");
      }
      throw error;
    }
  },

  async login(input: LoginInput) {
    const user = await authRepository.findByEmail(input.email);
    const valid = user ? await bcrypt.compare(input.password, user.passwordHash) : false;

    if (!user || !valid) {
      throw new AppError(401, "INVALID_CREDENTIALS", "Invalid email or password");
    }

    return { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt };
  },
};