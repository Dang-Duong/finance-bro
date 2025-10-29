import { NextResponse } from "next/server";
import dbConnect from "../db/dbConnect";
import Transaction from "../models/Transaction";
import User from "../models/User";
import { verifyToken, unauthorizedResponse } from "../utils/auth";

export async function GET(request: Request) {
  try {
    // Verify JWT token
    const authResult = verifyToken(request);
    if (!authResult.success) {
      return unauthorizedResponse(authResult.error);
    }

    await dbConnect();

    // Get user to find their userId
    const user = await User.findOne({ username: authResult.payload!.username });
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Fetch only transactions for the authenticated user
    const transactions = await Transaction.find({ userId: user._id })
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
}

export async function POST(request: Request) {
  try {
    // Verify JWT token
    const authResult = verifyToken(request);
    if (!authResult.success) {
      return unauthorizedResponse(authResult.error);
    }

    await dbConnect();
    const body = await request.json();
    const { amount, description, category, state, incoming, date } = body;

    // Validate required fields
    if (amount === undefined || amount === null) {
      return NextResponse.json(
        { success: false, error: "amount is required" },
        { status: 400 }
      );
    }

    if (incoming === undefined || incoming === null) {
      return NextResponse.json(
        { success: false, error: "incoming is required" },
        { status: 400 }
      );
    }

    // Get user from token
    const user = await User.findOne({ username: authResult.payload!.username });
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Create transaction
    const transaction = await Transaction.create({
      userId: user._id,
      amount,
      description,
      category,
      state: state || "pending",
      incoming,
      date: date || new Date(),
    });

    // Add transaction to user's transactions array
    user.transactions.push(transaction._id);
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
