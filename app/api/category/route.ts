import { NextResponse } from "next/server";
import dbConnect from "../db/dbConnect";
import Category from "../models/Category";
import { authenticateUser } from "../auth/middleware";

export async function GET() {
  try {
    const authUser = await authenticateUser();
    if (!authUser) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }
    await dbConnect();
    const categories = await Category.find();
    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    console.error("GET /api/category error:", error);
    return { success: false, error: "Failed to fetch categories" };
  }
}
