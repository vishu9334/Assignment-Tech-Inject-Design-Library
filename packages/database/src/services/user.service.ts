import { IUserContract } from "../data/contracts/IUser.contract";
import { postgresUserData } from "../data/implimentations/postgres.user.data";
import { ApiError } from "../utils/apiError";

export class UserService {
  constructor(private userRepo: IUserContract = postgresUserData) {}

  async listCustomers() {
    return this.userRepo.listCustomers();
  }

  async setPremiumAccess(userId: string, isPremium: boolean) {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    if (user.role === "ADMIN") {
      throw new ApiError(400, "Cannot change premium status for admin account");
    }

    const updated = await this.userRepo.setPremiumStatus(userId, isPremium);
    return {
      id: updated.id,
      email: updated.email,
      name: updated.name,
      role: updated.role,
      isPremium: updated.isPremium,
    };
  }

  async getCustomerStatus(userId: string) {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      isPremium: user.isPremium,
    };
  }
}

export const userService = new UserService();
