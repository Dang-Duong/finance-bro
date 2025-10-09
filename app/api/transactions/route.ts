import { NextResponse } from "next/server";
import dbConnect from "../db/dbConnect";
import Transaction from "../models/Transaction";
import User from "../models/User";

export async function GET() {
  try {
    await dbConnect();
    const transactions = await Transaction.find({})
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
    await dbConnect();
    const body = await request.json();
    const { userId, amount, description, date } = body;

    // Validate userId
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "userId is required" },
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
