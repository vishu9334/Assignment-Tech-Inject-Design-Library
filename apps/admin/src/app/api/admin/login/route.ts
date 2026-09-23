import { NextResponse } from "next/server";
import { authService, ApiError } from "@tech-inject/database";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { secret, email, password } = body;

    // Direct login via ADMIN_SECRET
    if (secret) {
      const result = await authService.adminLoginWithSecret(secret);
      return NextResponse.json({
        success: true,
        message: "Admin authenticated successfully",
        token: result.token,
        user: result.user,
      });
    }

    // Login via Admin email/password
    if (email && password) {
      const result = await authService.login(email, password);
      if (result.user.role !== "ADMIN") {
        return NextResponse.json(
          { success: false, message: "Unauthorized. Administrator account required." },
          { status: 403 }
        );
      }
      return NextResponse.json({
        success: true,
        message: "Admin authenticated successfully",
        token: result.token,
        user: result.user,
      });
    }

    return NextResponse.json(
      { success: false, message: "Provide either admin secret or email/password" },
      { status: 400 }
    );
  } catch (err: any) {
    if (err instanceof ApiError) {
      return NextResponse.json(
        { success: false, message: err.message },
        { status: err.statusCode }
      );
    }
    return NextResponse.json(
      { success: false, message: err.message || "Admin login failed" },
      { status: 500 }
    );
  }
}
