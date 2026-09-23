import { NextResponse } from "next/server";
import { componentService } from "@tech-inject/database";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") || undefined;
    const search = searchParams.get("search") || undefined;

    const components = await componentService.listPublished(category, search);

    return NextResponse.json({
      success: true,
      data: components,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Failed to load components" },
      { status: 500 }
    );
  }
}
