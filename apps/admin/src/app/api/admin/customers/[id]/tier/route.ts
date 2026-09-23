import { NextResponse } from "next/server";
import { userService, ApiError } from "@tech-inject/database";
import { verifyAdminRequest } from "@/lib/adminAuth";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await verifyAdminRequest(req);
    const { isPremium } = await req.json();

    if (typeof isPremium !== "boolean") {
      return NextResponse.json(
        { success: false, message: "isPremium boolean field required" },
        { status: 400 }
      );
    }

    const updated = await userService.setPremiumAccess(params.id, isPremium);
    return NextResponse.json({
      success: true,
      message: `Premium status ${isPremium ? "granted" : "revoked"} successfully`,
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
      { success: false, message: err.message || "Failed to update customer status" },
      { status: 500 }
    );
  }
}
