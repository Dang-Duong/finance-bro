import { NextResponse } from "next/server";
import dbConnect from "../../db/dbConnect";
import Transaction from "../../models/Transaction";
import User from "../../models/User";
import { verifyToken, unauthorizedResponse } from "../../utils/auth";
import mongoose from "mongoose";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify JWT token
    const authResult = verifyToken(request);
    if (!authResult.success) {
      return unauthorizedResponse(authResult.error);
    }

    const { id } = await params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid transaction ID" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Get user to verify ownership
    const user = await User.findOne({ username: authResult.payload!.username });
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Find transaction and verify it belongs to the user
    const transaction = await Transaction.findById(id).populate(
      "userId",
      "username"
    );

    if (!transaction) {
      return NextResponse.json(
        { success: false, error: "Transaction not found" },
        { status: 404 }
      );
    }

    // Check if transaction belongs to the authenticated user
    if (transaction.userId._id.toString() !== user._id.toString()) {
      return NextResponse.json(
        { success: false, error: "Unauthorized to access this transaction" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    console.error("GET /api/transactions/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch transaction" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify JWT token
    const authResult = verifyToken(request);
    if (!authResult.success) {
      return unauthorizedResponse(authResult.error);
    }

    const { id } = await params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid transaction ID" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Get user to verify ownership
    const user = await User.findOne({ username: authResult.payload!.username });
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Find transaction and verify it belongs to the user
    const transaction = await Transaction.findById(id);

    if (!transaction) {
      return NextResponse.json(
        { success: false, error: "Transaction not found" },
        { status: 404 }
      );
    }

    // Check if transaction belongs to the authenticated user
    if (transaction.userId.toString() !== user._id.toString()) {
      return NextResponse.json(
        { success: false, error: "Unauthorized to update this transaction" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { amount, description, category, state, incoming, date } = body;

    // Update only provided fields
    if (amount !== undefined) transaction.amount = amount;
    if (description !== undefined) transaction.description = description;
    if (category !== undefined) transaction.category = category;
    if (state !== undefined) transaction.state = state;
    if (incoming !== undefined) transaction.incoming = incoming;
    if (date !== undefined) transaction.date = date;

    await transaction.save();

    return NextResponse.json({
      success: true,
      data: transaction,
      message: "Transaction updated successfully",
    });
  } catch (error) {
    console.error("PUT /api/transactions/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update transaction" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify JWT token
    const authResult = verifyToken(request);
    if (!authResult.success) {
      return unauthorizedResponse(authResult.error);
    }

    const { id } = await params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid transaction ID" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Get user to verify ownership
    const user = await User.findOne({ username: authResult.payload!.username });
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Find transaction and verify it belongs to the user
    const transaction = await Transaction.findById(id);

    if (!transaction) {
      return NextResponse.json(
        { success: false, error: "Transaction not found" },
        { status: 404 }
      );
    }

    // Check if transaction belongs to the authenticated user
    if (transaction.userId.toString() !== user._id.toString()) {
      return NextResponse.json(
        { success: false, error: "Unauthorized to delete this transaction" },
        { status: 403 }
      );
    }

    // Remove transaction from user's transactions array
    user.transactions = user.transactions.filter(
      (transactionId) => transactionId.toString() !== id
    );
    await user.save();

    // Delete the transaction
    await Transaction.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Transaction deleted successfully",
      id: id,
    });
  } catch (error) {
    console.error("DELETE /api/transactions/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete transaction" },
      { status: 500 }
    );
  }
}