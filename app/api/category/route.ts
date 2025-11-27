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
    return NextResponse.json(
      { success: false, error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const authUser = await authenticateUser();
    if (!authUser) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }
    await dbConnect();
    const body = await request.json();
    const { name } = body;

    // kontrola, zda kategorie již neexistuje
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return NextResponse.json(
        { success: false, error: "Category already exists" },
        { status: 400 }
      );
    }

    const newCategory = new Category({ name });
    await newCategory.save();

    return NextResponse.json({
      success: true,
      data: newCategory,
    });
  } catch (error) {
    console.error("POST /api/category error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create category" },
      { status: 500 }
    );
  }
}
