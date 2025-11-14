import { NextResponse } from "next/server";
import dbConnect from "../db/dbConnect";
import Transaction from "../models/Transaction";
import User from "../models/User";
import { authenticateUser } from "../auth/middleware";
import mongoose from "mongoose";
import Category from "../models/Category";

export async function GET() {
  try {
    // Ověření autentizace
    const authUser = await authenticateUser();
    if (!authUser) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();

    // Získání pouze transakcí přihlášeného uživatele
    const transactions = await Transaction.find({ userId: authUser.userId })
      .populate("userId", "username")
      .populate("category", "name")
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: transactions,
    });
  } catch (error) {
    console.error("GET /api/transactions error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // Ověření autentizace
    const authUser = await authenticateUser();
    if (!authUser) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();
    const body = await request.json();
    const { amount, description, incoming, date } = body;

    // Použití userId z autentizovaného uživatele
    const userId = authUser.userId;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    const categoryExist = await Category.findById(body.category);
    if (!categoryExist) {
      return NextResponse.json(
        { success: false, error: "Invalid category" },
        { status: 404 }
      );
    }

    // Create transaction
    const transaction = await Transaction.create({
      userId: user._id,
      amount,
      description,
      incoming,
      date: date ? new Date(date) : new Date(),
      category: categoryExist._id,
    });

    // Add transaction to user's transactions array
    (user.transactions as mongoose.Types.ObjectId[]).push(
      transaction._id as mongoose.Types.ObjectId
    );
    await user.save();

    return NextResponse.json(
      {
        success: true,
        data: transaction,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/transactions error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create transaction" },
      { status: 400 }
    );
  }
}

export async function DELETE() {
  try {
    // Ověření autentizace
    const authUser = await authenticateUser();
    if (!authUser) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();

    // Delete all transactions for the authenticated user
    const result = await Transaction.deleteMany({ userId: authUser.userId });

    // Clear transactions array from user
    const user = await User.findById(authUser.userId);
    if (user) {
      user.transactions = [];
      await user.save();
    }

    return NextResponse.json({
      success: true,
      message: `Deleted ${result.deletedCount} transactions`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("DELETE /api/transactions error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete transactions" },
      { status: 500 }
    );
  }
}
