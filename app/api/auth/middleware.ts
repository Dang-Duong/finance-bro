import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import User from "../models/User";
import dbConnect from "../db/dbConnect";

export interface AuthUser {
  userId: string;
  username: string;
  email: string;
}

export async function authenticateUser(): Promise<AuthUser | null> {
  try {
    await dbConnect();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return null;
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as AuthUser;

    const user = await User.findById(decoded.userId);
    if (!user || !user.tokens.includes(token)) {
      return null;
    }

    return decoded;
  } catch (error) {
    console.error("Authentication error:", error);
    return null;
  }
}

export async function getTokenFromCookies(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("token")?.value || null;
}
