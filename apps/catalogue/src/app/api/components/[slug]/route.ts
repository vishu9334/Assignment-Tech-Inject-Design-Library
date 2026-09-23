import { NextResponse } from "next/server";
import { componentService, authService, ApiError } from "@tech-inject/database";

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.substring(7)
      : undefined;

    const auth = await authService.authenticateRequest(token);

    const component = await componentService.getPublishedBySlug(params.slug, {
      isAuthenticated: auth.isAuthenticated,
      isAdmin: auth.isAdmin,
      isPremium: auth.isPremium,
    });

    return NextResponse.json({
      success: true,
      data: component,
    });
  } catch (err: any) {
    if (err instanceof ApiError) {
      return NextResponse.json(
        { success: false, message: err.message },
        { status: err.statusCode }
      );
    }
    return NextResponse.json(
      { success: false, message: err.message || "Failed to load component" },
      { status: 500 }
    );
  }
}
