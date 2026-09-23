import { NextResponse } from "next/server";
import { userService, ApiError } from "@tech-inject/database";
import { verifyAdminRequest } from "@/lib/adminAuth";

export async function GET(req: Request) {
  try {
    await verifyAdminRequest(req);
    const customers = await userService.listCustomers();
    return NextResponse.json({ success: true, data: customers });
  } catch (err: any) {
    if (err instanceof ApiError) {
      return NextResponse.json(
        { success: false, message: err.message },
        { status: err.statusCode }
      );
    }
    return NextResponse.json(
      { success: false, message: err.message || "Failed to list customers" },
      { status: 500 }
    );
  }
}
