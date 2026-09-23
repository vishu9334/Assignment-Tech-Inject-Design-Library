import { IComponentContract, CreateComponentData, UpdateComponentData } from "../data/contracts/IComponent.contract";
import { postgresComponentData } from "../data/implimentations/postgres.component.data";
import { ApiError } from "../utils/apiError";

export interface ComponentViewerContext {
  isAuthenticated: boolean;
  isAdmin?: boolean;
  isPremium?: boolean;
}

export class ComponentService {
  constructor(private componentRepo: IComponentContract = postgresComponentData) {}

  /**
   * Public Catalogue: List published components
   */
  async listPublished(category?: string, search?: string) {
    const components = await this.componentRepo.list({
      status: "PUBLISHED",
      category,
      search,
    });

    // Strip sensitive code in list view to keep payload fast and protect source
    return components.map((comp) => ({
      id: comp.id,
      slug: comp.slug,
      name: comp.name,
      description: comp.description,
      category: comp.category,
      version: comp.version,
      accessLevel: comp.accessLevel,
      status: comp.status,
      dependencies: comp.dependencies,
      thumbnailUrl: comp.thumbnailUrl,
      updatedAt: comp.updatedAt,
    }));
  }

  /**
   * Public Catalogue: Get single component with access enforcement
   */
  async getPublishedBySlug(slug: string, viewer: ComponentViewerContext) {
    const comp = await this.componentRepo.findBySlug(slug);
    if (!comp || comp.status !== "PUBLISHED") {
      throw new ApiError(404, "Component not found");
    }

    const hasAccess =
      comp.accessLevel === "FREE" ||
      viewer.isAdmin === true ||
      (viewer.isAuthenticated && viewer.isPremium === true);

    if (!hasAccess) {
      // Return masked payload for locked state
      return {
        id: comp.id,
        slug: comp.slug,
        name: comp.name,
        description: comp.description,
        category: comp.category,
        version: comp.version,
        accessLevel: comp.accessLevel,
        status: comp.status,
        dependencies: comp.dependencies,
        thumbnailUrl: comp.thumbnailUrl,
        isLocked: true,
        lockReason: !viewer.isAuthenticated
          ? "Please sign in to access premium components."
          : "Active premium account required to access code, previews, and installer.",
        code: null,
        usageExample: null,
        agentPrompt: null,
        propsDoc: comp.propsDoc,
      };
    }

    // Full access granted
    return {
      ...comp,
      isLocked: false,
    };
  }

  /**
   * Code Download / NPX Installer API with Server-side Access Enforcement
   */
  async getInstallPayload(slug: string, viewer: ComponentViewerContext) {
    const comp = await this.componentRepo.findBySlug(slug);
    if (!comp || comp.status !== "PUBLISHED") {
      throw new ApiError(404, "Component not found or unpublished");
    }

    const hasAccess =
      comp.accessLevel === "FREE" ||
      viewer.isAdmin === true ||
      (viewer.isAuthenticated && viewer.isPremium === true);

    if (!hasAccess) {
      throw new ApiError(
        403,
        "Premium access required. Please upgrade or sign in with an authorized account."
      );
    }

    return {
      slug: comp.slug,
      name: comp.name,
      category: comp.category,
      version: comp.version,
      accessLevel: comp.accessLevel,
      code: comp.code,
      usageExample: comp.usageExample,
      dependencies: comp.dependencies,
      filename: `${comp.name}.tsx`,
    };
  }

  /**
   * Admin Operations: View all components (including drafts)
   */
  async adminListAll(category?: string, search?: string) {
    return this.componentRepo.list({ category, search });
  }

  async adminGetById(id: string) {
    const comp = await this.componentRepo.findById(id);
    if (!comp) {
      throw new ApiError(404, "Component not found");
    }
    return comp;
  }

  async adminCreate(data: CreateComponentData) {
    if (!data.name || !data.slug || !data.code || !data.category) {
      throw new ApiError(400, "Name, slug, category, and code are required");
    }

    const existing = await this.componentRepo.findBySlug(data.slug);
    if (existing) {
      throw new ApiError(409, `Component slug '${data.slug}' already exists`);
    }

    return this.componentRepo.create(data);
  }

  async adminUpdate(id: string, data: UpdateComponentData) {
    const existing = await this.componentRepo.findById(id);
    if (!existing) {
      throw new ApiError(404, "Component not found");
    }

    return this.componentRepo.update(id, data);
  }

  async adminPublish(id: string) {
    const existing = await this.componentRepo.findById(id);
    if (!existing) {
      throw new ApiError(404, "Component not found");
    }
    return this.componentRepo.publish(id);
  }

  async adminUnpublish(id: string) {
    const existing = await this.componentRepo.findById(id);
    if (!existing) {
      throw new ApiError(404, "Component not found");
    }
    return this.componentRepo.unpublish(id);
  }

  async adminDelete(id: string) {
    const existing = await this.componentRepo.findById(id);
    if (!existing) {
      throw new ApiError(404, "Component not found");
    }
    await this.componentRepo.delete(id);
  }
}

export const componentService = new ComponentService();
