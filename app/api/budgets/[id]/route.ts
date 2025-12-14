import { NextResponse } from "next/server";
import dbConnect from "../../db/dbConnect";
import Budget from "../../models/Budget";
import { authenticateUser } from "../../auth/middleware";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = await authenticateUser();
    if (!authUser) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();
    const { id } = await params;
    const body = await request.json();
    const { amount } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { success: false, error: "Amount must be greater than 0" },
        { status: 400 }
      );
    }

    // Find budget and verify ownership
    const budget = await Budget.findById(id);
    if (!budget) {
      return NextResponse.json(
        { success: false, error: "Budget not found" },
        { status: 404 }
      );
    }

    if (budget.userId.toString() !== authUser.userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

    // Update budget
    budget.amount = amount;
    await budget.save();

    const updatedBudget = await Budget.findById(budget._id)
      .populate("category", "name")
      .populate("userId", "username");

    return NextResponse.json({
      success: true,
      message: "Budget updated successfully",
      data: updatedBudget,
    });
  } catch (error) {
    console.error("PUT /api/budgets/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update budget" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = await authenticateUser();
    if (!authUser) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();
    const { id } = await params;

    // Find budget and verify ownership
    const budget = await Budget.findById(id);
    if (!budget) {
      return NextResponse.json(
        { success: false, error: "Budget not found" },
        { status: 404 }
      );
    }

    if (budget.userId.toString() !== authUser.userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

    // Delete budget
    await Budget.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Budget deleted successfully",
    });
  } catch (error) {
    console.error("DELETE /api/budgets/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete budget" },
      { status: 500 }
    );
  }
}
