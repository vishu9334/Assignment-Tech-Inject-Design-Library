import { IUserContract } from "../data/contracts/IUser.contract";
import { postgresUserData } from "../data/implimentations/postgres.user.data";
import { comparePassword, generateToken, verifyToken } from "../utils/token";
import { ApiError } from "../utils/apiError";

export class AuthService {
  constructor(private userRepo: IUserContract = postgresUserData) {}

  /**
   * Customer / Admin sign in
   */
  async login(email: string, plainPass: string) {
    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      throw new ApiError(401, "Invalid email or password");
    }

    const isValid = await comparePassword(plainPass, user.password);
    if (!isValid) {
      throw new ApiError(401, "Invalid email or password");
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      isPremium: user.isPremium,
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        isPremium: user.isPremium,
      },
    };
  }

  /**
   * Admin direct login with ADMIN_SECRET
   */
  async adminLoginWithSecret(secret: string) {
    const configuredSecret = process.env.ADMIN_SECRET || "tech-inject-admin-secure-key-2026";
    if (secret !== configuredSecret) {
      throw new ApiError(401, "Invalid admin credentials");
    }

    const token = generateToken({
      userId: "admin-root",
      email: "admin@techinject.io",
      role: "ADMIN",
      isPremium: true,
    });

    return {
      token,
      user: {
        id: "admin-root",
        email: "admin@techinject.io",
        name: "TechInject Administrator",
        role: "ADMIN" as const,
        isPremium: true,
      },
    };
  }

  /**
   * Real-time Auth context verification
   * Crucial requirement: Must check current live DB status so revocation immediately blocks access!
   */
  async authenticateRequest(token?: string) {
    if (!token) {
      return { isAuthenticated: false, isPremium: false, isAdmin: false };
    }

    const payload = verifyToken(token);
    if (!payload) {
      return { isAuthenticated: false, isPremium: false, isAdmin: false };
    }

    if (payload.role === "ADMIN") {
      return {
        isAuthenticated: true,
        isAdmin: true,
        isPremium: true,
        user: { id: payload.userId, email: payload.email, role: "ADMIN" },
      };
    }

    // Query live user record from DB to verify if premium was revoked in real time!
    const liveUser = await this.userRepo.findById(payload.userId);
    if (!liveUser) {
      return { isAuthenticated: false, isPremium: false, isAdmin: false };
    }

    return {
      isAuthenticated: true,
      isAdmin: false,
      isPremium: liveUser.isPremium,
      user: {
        id: liveUser.id,
        email: liveUser.email,
        name: liveUser.name,
        role: liveUser.role,
        isPremium: liveUser.isPremium,
      },
    };
  }
}

export const authService = new AuthService();
