import { Component, AccessLevel, PublishStatus, Prisma } from "@prisma/client";

export interface CreateComponentData {
  slug: string;
  name: string;
  description: string;
  category: string;
  version?: string;
  accessLevel?: AccessLevel;
  status?: PublishStatus;
  code: string;
  usageExample: string;
  agentPrompt: string;
  dependencies?: string[];
  propsDoc?: Prisma.InputJsonValue;
  thumbnailUrl?: string;
}

export interface UpdateComponentData extends Partial<CreateComponentData> {}

export interface ComponentFilter {
  category?: string;
  search?: string;
  accessLevel?: AccessLevel;
  status?: PublishStatus;
}

export interface IComponentContract {
  findById(id: string): Promise<Component | null>;
  findBySlug(slug: string): Promise<Component | null>;
  list(filter?: ComponentFilter): Promise<Component[]>;
  create(data: CreateComponentData): Promise<Component>;
  update(id: string, data: UpdateComponentData): Promise<Component>;
  delete(id: string): Promise<void>;
  publish(id: string): Promise<Component>;
  unpublish(id: string): Promise<Component>;
}
