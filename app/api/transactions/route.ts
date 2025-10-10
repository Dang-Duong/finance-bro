import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "../db/dbConnect";
import Transaction from "../models/Transaction";
import User from "../models/User";
import { withAuth } from "../middleware/auth";

// PROTECTED ENDPOINT - Requires JWT token
// Returns only transactions for the authenticated user
export const GET = withAuth(async (request, context, payload) => {
  try {
    await dbConnect();

    // Get only transactions for the authenticated user
    const transactions = await Transaction.find({ userId: payload.userId })
      .populate("userId", "username")
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
});

// PROTECTED ENDPOINT - Requires JWT token
// Creates transaction for the authenticated user
export const POST = withAuth(async (request, context, payload) => {
  try {
    await dbConnect();
    const body = await request.json();
    const { amount, description, date } = body;

    // userId is taken from JWT token, not from request body
    const userId = payload.userId;

    // Validate required fields
    if (!amount || !description) {
      return NextResponse.json(
        { success: false, error: "amount and description are required" },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Create transaction
    const transaction = await Transaction.create({
      userId,
      amount,
      description,
      date: date || new Date(),
    });

    // Add transaction to user's transactions array
    user.transactions.push(transaction._id as mongoose.Types.ObjectId);
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
});
