import { NextResponse } from "next/server";
import dbConnect from "../../db/dbConnect";
import SavingGoal from "../../models/SavingGoal";
import SavingDeposit from "../../models/SavingDeposit";
import { authenticateUser } from "../../auth/middleware";

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

    // Fetch all savings goals for the user
    const goals = await SavingGoal.find({ userId: authUser.userId });

    // Calculate currentAmount from deposits for each goal
    const goalsWithCalculatedAmount = await Promise.all(
      goals.map(async (goal) => {
        const deposits = await SavingDeposit.find({
          userId: authUser.userId,
          goalId: goal._id,
        });

        const calculatedAmount = deposits.reduce(
          (sum, deposit) => sum + deposit.amount,
          0
        );

        // Update the goal's currentAmount if it differs
        if (goal.currentAmount !== calculatedAmount) {
          goal.currentAmount = calculatedAmount;
          await goal.save();
        }

        return {
          _id: String(goal._id),
          userId: goal.userId.toString(),
          name: goal.name,
          goalAmount: goal.goalAmount,
          currentAmount: calculatedAmount,
          createdAt: goal.createdAt,
          updatedAt: goal.updatedAt,
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: goalsWithCalculatedAmount,
    });
  } catch (error) {
    console.error("GET /api/savings/goals error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch savings goals" },
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
    const { name, goalAmount } = body;

    if (!name || !goalAmount) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (goalAmount <= 0) {
      return NextResponse.json(
        { success: false, error: "Goal amount must be greater than 0" },
        { status: 400 }
      );
    }

    // Create new savings goal
    const goal = await SavingGoal.create({
      userId: authUser.userId,
      name: name.trim(),
      goalAmount,
      currentAmount: 0,
    });

    return NextResponse.json(
      {
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
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/savings/goals error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create savings goal" },
      { status: 500 }
    );
  }
}
