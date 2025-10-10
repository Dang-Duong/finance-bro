import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("Please define the JWT_SECRET environment variable");
}

export interface JWTPayload {
  userId: string;
  username: string;
  iat: number;
  exp: number;
}

/**
 * Verifies JWT token from Authorization header
 * Returns the decoded payload if valid, null otherwise
 */
export function verifyToken(request: NextRequest): JWTPayload | null {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null;
    }

    const token = authHeader.substring(7); // Remove "Bearer " prefix

    const decoded = jwt.verify(token, JWT_SECRET as string) as JWTPayload;
    return decoded;
  } catch (error) {
    console.error("Token verification error:", error);
    return null;
  }
}

/**
 * Middleware wrapper for protected routes
 * Usage: wrap your route handler with this function
 */
export function withAuth(
  handler: (
    request: NextRequest,
    context: { params: Promise<Record<string, string>> },
    payload: JWTPayload
  ) => Promise<NextResponse>
) {
  return async (
    request: NextRequest,
    context: { params: Promise<Record<string, string>> }
  ): Promise<NextResponse> => {
    const payload = verifyToken(request);

    if (!payload) {
      return NextResponse.json(
        { error: "Unauthorized - Invalid or missing token" },
        { status: 401 }
      );
    }

    return handler(request, context, payload);
  };
}

/**
 * Simple function to create unauthorized response
 */
export function unauthorizedResponse(message = "Unauthorized") {
  return NextResponse.json({ error: message }, { status: 401 });
}