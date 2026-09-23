import { User, PrismaClient } from "@prisma/client";
import {
  IUserContract,
  CreateUserData,
  UpdateUserData,
} from "../contracts/IUser.contract";
import prismaClient from "../../prisma";

export class PostgresUserData implements IUserContract {
  private prisma: PrismaClient;

  constructor(client: PrismaClient = prismaClient) {
    this.prisma = client;
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });
  }

  async create(data: CreateUserData): Promise<User> {
    return this.prisma.user.create({
      data: {
        email: data.email.toLowerCase().trim(),
        password: data.password,
        name: data.name,
        role: data.role || "CUSTOMER",
        isPremium: data.isPremium ?? false,
      },
    });
  }

  async update(id: string, data: UpdateUserData): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async setPremiumStatus(id: string, isPremium: boolean): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: { isPremium },
    });
  }

  async listCustomers(): Promise<Omit<User, "password">[]> {
    return this.prisma.user.findMany({
      where: { role: "CUSTOMER" },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isPremium: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }
}

export const postgresUserData = new PostgresUserData();
