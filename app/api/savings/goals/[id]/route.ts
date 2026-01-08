import { NextResponse } from "next/server";
import dbConnect from "../../../db/dbConnect";
import SavingGoal from "../../../models/SavingGoal";
import SavingDeposit from "../../../models/SavingDeposit";
import { authenticateUser } from "../../../auth/middleware";

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
    const { name, goalAmount } = body;

    const goal = await SavingGoal.findById(id);
    if (!goal) {
      return NextResponse.json(
        { success: false, error: "Goal not found" },
        { status: 404 }
      );
    }

    if (goal.userId.toString() !== authUser.userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

    if (name !== undefined) {
      goal.name = name.trim();
    }
    if (goalAmount !== undefined) {
      if (goalAmount <= 0) {
        return NextResponse.json(
          { success: false, error: "Goal amount must be greater than 0" },
          { status: 400 }
        );
      }
      goal.goalAmount = goalAmount;
    }

    await goal.save();

    return NextResponse.json({
      success: true,
      data: {
        _id: String(goal._id),
        userId: goal.userId.toString(),
        name: goal.name,
        goalAmount: goal.goalAmount,
        currentAmount: goal.currentAmount,
        createdAt: goal.createdAt,
        updatedAt: goal.updatedAt,
      },
    });
  } catch (error) {
    console.error("PUT /api/savings/goals/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update goal" },
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

    const goal = await SavingGoal.findById(id);
    if (!goal) {
      return NextResponse.json(
        { success: false, error: "Goal not found" },
        { status: 404 }
      );
    }

    if (goal.userId.toString() !== authUser.userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

    await SavingDeposit.deleteMany({ goalId: id });

    await SavingGoal.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Goal deleted",
    });
  } catch (error) {
    console.error("DELETE /api/savings/goals/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete goal" },
      { status: 500 }
    );
  }
}
