import { NextResponse } from "next/server";
import { componentService, ApiError } from "@tech-inject/database";
import { verifyAdminRequest } from "@/lib/adminAuth";

export async function GET(req: Request) {
  try {
    await verifyAdminRequest(req);
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") || undefined;
    const search = searchParams.get("search") || undefined;

    const components = await componentService.adminListAll(category, search);
    return NextResponse.json({ success: true, data: components });
  } catch (err: any) {
    if (err instanceof ApiError) {
      return NextResponse.json(
        { success: false, message: err.message },
        { status: err.statusCode }
      );
    }
    return NextResponse.json(
      { success: false, message: err.message || "Failed to list components" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await verifyAdminRequest(req);
    const body = await req.json();

    const created = await componentService.adminCreate(body);
    return NextResponse.json({
      success: true,
      message: "Component created successfully",
      data: created,
    });
  } catch (err: any) {
    if (err instanceof ApiError) {
      return NextResponse.json(
        { success: false, message: err.message },
        { status: err.statusCode }
      );
    }
    return NextResponse.json(
      { success: false, message: err.message || "Failed to create component" },
      { status: 500 }
    );
  }
}
