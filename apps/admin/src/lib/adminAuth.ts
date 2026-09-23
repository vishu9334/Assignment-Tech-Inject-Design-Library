import { authService, ApiError } from "@tech-inject/database";

export async function verifyAdminRequest(req: Request) {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.substring(7)
    : undefined;

  const auth = await authService.authenticateRequest(token);
  if (!auth.isAuthenticated || !auth.isAdmin) {
    throw new ApiError(403, "Access denied: Administrator privileges required");
  }

  return auth;
}
