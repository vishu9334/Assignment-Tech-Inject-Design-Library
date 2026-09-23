import { NextResponse } from "next/server";
import { authService, ApiError } from "@tech-inject/database";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    const result = await authService.login(email, password);
    return NextResponse.json({
      success: true,
      message: "Login successful",
      token: result.token,
      user: result.user,
    });
  } catch (err: any) {
    if (err instanceof ApiError) {
      return NextResponse.json(
        { success: false, message: err.message },
        { status: err.statusCode }
      );
    }
    return NextResponse.json(
      { success: false, message: err.message || "Authentication failed" },
      { status: 500 }
    );
  }
}
