import { NextResponse } from "next/server";
import { authService } from "@tech-inject/database";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.substring(7)
      : undefined;

    const auth = await authService.authenticateRequest(token);
    if (!auth.isAuthenticated || !auth.user) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user: auth.user,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Failed to fetch user" },
      { status: 500 }
    );
  }
}
