import { User, Role } from "@prisma/client";

export interface CreateUserData {
  email: string;
  password: string;
  name: string;
  role?: Role;
  isPremium?: boolean;
}

export interface UpdateUserData {
  name?: string;
  isPremium?: boolean;
  role?: Role;
}

export interface IUserContract {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(data: CreateUserData): Promise<User>;
  update(id: string, data: UpdateUserData): Promise<User>;
  setPremiumStatus(id: string, isPremium: boolean): Promise<User>;
  listCustomers(): Promise<Omit<User, "password">[]>;
}
