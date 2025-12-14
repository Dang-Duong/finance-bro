import { NextResponse } from "next/server";
import dbConnect from "../../../db/dbConnect";
import SavingDeposit from "../../../models/SavingDeposit";
import SavingGoal from "../../../models/SavingGoal";
import { authenticateUser } from "../../../auth/middleware";

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

    // Find deposit and verify ownership
    const deposit = await SavingDeposit.findById(id);
    if (!deposit) {
      return NextResponse.json(
        { success: false, error: "Deposit not found" },
        { status: 404 }
      );
    }

    if (deposit.userId.toString() !== authUser.userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

    // Get the goal to update its currentAmount
    const goal = await SavingGoal.findById(deposit.goalId);
    if (goal) {
      // Subtract the deposit amount from goal's currentAmount
      goal.currentAmount = Math.max(
        0,
        (goal.currentAmount || 0) - deposit.amount
      );
      await goal.save();
    }

    // Delete the deposit
    await SavingDeposit.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Deposit deleted",
    });
  } catch (error) {
    console.error("DELETE /api/savings/deposits/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete deposit" },
      { status: 500 }
    );
  }
}
