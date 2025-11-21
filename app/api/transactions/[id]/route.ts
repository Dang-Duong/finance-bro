import { NextResponse } from "next/server";
import dbConnect from "../../db/dbConnect";
import Transaction from "../../models/Transaction";
import User from "../../models/User";
import { authenticateUser } from "../../auth/middleware";
import mongoose from "mongoose";
import Category from "../../models/Category";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Ověření autentizace
    const authUser = await authenticateUser();
    if (!authUser) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
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

    // Find transaction and verify it belongs to the user
    const transaction = await Transaction.findById(id)
      .populate("userId", "username")
      .populate("category", "name");

    if (!transaction) {
      return NextResponse.json(
        { success: false, error: "Transaction not found" },
        { status: 404 }
      );
    }

    // Check if transaction belongs to the authenticated user
    if (transaction.userId._id.toString() !== authUser.userId) {
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
    // Ověření autentizace
    const authUser = await authenticateUser();
    if (!authUser) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
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

    // Find transaction and verify it belongs to the user
    const transaction = await Transaction.findById(id);

    if (!transaction) {
      return NextResponse.json(
        { success: false, error: "Transaction not found" },
        { status: 404 }
      );
    }

    // Check if transaction belongs to the authenticated user
    if (transaction.userId.toString() !== authUser.userId) {
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
    if (category !== undefined) {
      // validate category exists and store as ObjectId
      const categoryExist = await Category.findById(category);
      if (!categoryExist) {
        return NextResponse.json(
          { success: false, error: "Invalid category" },
          { status: 404 }
        );
      }
      transaction.category = categoryExist._id as mongoose.Types.ObjectId;
    }
    if (state !== undefined) transaction.state = state;
    if (incoming !== undefined) transaction.incoming = incoming;
    if (date !== undefined) transaction.date = new Date(date);

    await transaction.save();

    const populatedTransaction = await Transaction.findById(transaction._id)
      .populate("category", "name")
      .populate("userId", "username");

    return NextResponse.json({
      success: true,
      data: populatedTransaction,
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
    // Ověření autentizace
    const authUser = await authenticateUser();
    if (!authUser) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
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

    // Find transaction and verify it belongs to the user
    const transaction = await Transaction.findById(id);

    if (!transaction) {
      return NextResponse.json(
        { success: false, error: "Transaction not found" },
        { status: 404 }
      );
    }

    // Check if transaction belongs to the authenticated user
    if (transaction.userId.toString() !== authUser.userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized to delete this transaction" },
        { status: 403 }
      );
    }

    // Remove transaction from user's transactions array
    const user = await User.findById(authUser.userId);
    if (user) {
      (user.transactions as mongoose.Types.ObjectId[]) = (
        user.transactions as mongoose.Types.ObjectId[]
      ).filter((transactionId) => transactionId.toString() !== id);
      await user.save();
    }

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
