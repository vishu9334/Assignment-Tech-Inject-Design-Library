import { NextResponse } from "next/server";
import { componentService, ApiError } from "@tech-inject/database";
import { verifyAdminRequest } from "@/lib/adminAuth";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await verifyAdminRequest(req);
    const { action } = await req.json(); // "publish" or "unpublish"

    const updated =
      action === "unpublish"
        ? await componentService.adminUnpublish(params.id)
        : await componentService.adminPublish(params.id);

    return NextResponse.json({
      success: true,
      message: `Component ${action === "unpublish" ? "unpublished" : "published"} successfully`,
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
      { success: false, message: err.message || "Failed to update publication status" },
      { status: 500 }
    );
  }
}
