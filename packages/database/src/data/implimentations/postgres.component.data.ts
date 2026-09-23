import { Component, PrismaClient, Prisma } from "@prisma/client";
import {
  IComponentContract,
  CreateComponentData,
  UpdateComponentData,
  ComponentFilter,
} from "../contracts/IComponent.contract";
import prismaClient from "../../prisma";

export class PostgresComponentData implements IComponentContract {
  private prisma: PrismaClient;

  constructor(client: PrismaClient = prismaClient) {
    this.prisma = client;
  }

  async findById(id: string): Promise<Component | null> {
    return this.prisma.component.findUnique({ where: { id } });
  }

  async findBySlug(slug: string): Promise<Component | null> {
    return this.prisma.component.findUnique({ where: { slug } });
  }

  async list(filter?: ComponentFilter): Promise<Component[]> {
    const where: Prisma.ComponentWhereInput = {};

    if (filter?.status) {
      where.status = filter.status;
    }

    if (filter?.accessLevel) {
      where.accessLevel = filter.accessLevel;
    }

    if (filter?.category) {
      where.category = {
        equals: filter.category,
        mode: "insensitive",
      };
    }

    if (filter?.search) {
      where.OR = [
        { name: { contains: filter.search, mode: "insensitive" } },
        { description: { contains: filter.search, mode: "insensitive" } },
        { slug: { contains: filter.search, mode: "insensitive" } },
        { category: { contains: filter.search, mode: "insensitive" } },
      ];
    }

    return this.prisma.component.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
  }

  async create(data: CreateComponentData): Promise<Component> {
    return this.prisma.component.create({
      data: {
        slug: data.slug,
        name: data.name,
        description: data.description,
        category: data.category,
        version: data.version || "1.0.0",
        accessLevel: data.accessLevel || "FREE",
        status: data.status || "DRAFT",
        code: data.code,
        usageExample: data.usageExample,
        agentPrompt: data.agentPrompt,
        dependencies: data.dependencies || [],
        propsDoc: data.propsDoc ?? Prisma.JsonNull,
        thumbnailUrl: data.thumbnailUrl,
      },
    });
  }

  async update(id: string, data: UpdateComponentData): Promise<Component> {
    const updatePayload: Prisma.ComponentUpdateInput = {
      ...data,
      propsDoc: data.propsDoc !== undefined ? data.propsDoc : undefined,
    };

    return this.prisma.component.update({
      where: { id },
      data: updatePayload,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.component.delete({ where: { id } });
  }

  async publish(id: string): Promise<Component> {
    return this.prisma.component.update({
      where: { id },
      data: { status: "PUBLISHED" },
    });
  }

  async unpublish(id: string): Promise<Component> {
    return this.prisma.component.update({
      where: { id },
      data: { status: "DRAFT" },
    });
  }
}

export const postgresComponentData = new PostgresComponentData();
