import { NextResponse } from "next/server";
import { componentService, ApiError } from "@tech-inject/database";
import { verifyAdminRequest } from "@/lib/adminAuth";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await verifyAdminRequest(req);
    const body = await req.json();

    const updated = await componentService.adminUpdate(params.id, body);
    return NextResponse.json({
      success: true,
      message: "Component updated successfully",
      data: updated,
    });
  } catch (err: any) {
    if (err instanceof ApiError) {
      return NextResponse.json(
        { success: false, message: err.message },
        { status: err.statusCode }
      );
    }
    return NextResponse.json(
      { success: false, message: err.message || "Failed to update component" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await verifyAdminRequest(req);
    await componentService.adminDelete(params.id);
    return NextResponse.json({
      success: true,
      message: "Component deleted successfully",
    });
  } catch (err: any) {
    if (err instanceof ApiError) {
      return NextResponse.json(
        { success: false, message: err.message },
        { status: err.statusCode }
      );
    }
    return NextResponse.json(
      { success: false, message: err.message || "Failed to delete component" },
      { status: 500 }
    );
  }
}
