import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "../../db/dbConnect";
import SavingDeposit from "../../models/SavingDeposit";
import SavingGoal from "../../models/SavingGoal";
import { authenticateUser } from "../../auth/middleware";

export async function GET(request: Request) {
  try {
    const authUser = await authenticateUser();
    if (!authUser) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();

    // Get query parameters
    const url = new URL(request.url);
    const goalIdParam = url.searchParams.get("goalId");

    const query: Record<string, unknown> = { userId: authUser.userId };
    if (goalIdParam) {
      query.goalId = goalIdParam;
    }

    // Fetch deposits, sorted by date descending
    const deposits = await SavingDeposit.find(query).sort({ date: -1 });

    const depositsData = deposits.map((deposit) => ({
      _id: String(deposit._id),
      userId: String(deposit.userId),
      goalId: String(deposit.goalId),
      amount: deposit.amount,
      date: deposit.date,
      createdAt: deposit.createdAt,
      updatedAt: deposit.updatedAt,
    }));

    return NextResponse.json({
      success: true,
      data: depositsData,
    });
  } catch (error) {
    console.error("GET /api/savings/deposits error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch deposits" },
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
    const { goalId, amount, date } = body;

    if (!goalId || !amount) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (amount <= 0) {
      return NextResponse.json(
        { success: false, error: "Amount must be greater than 0" },
        { status: 400 }
      );
    }

    // Verify goal exists and belongs to user
    const goal = await SavingGoal.findById(goalId);
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

    // Create deposit - ensure goalId is converted to ObjectId
    const deposit = await SavingDeposit.create({
      userId: new mongoose.Types.ObjectId(authUser.userId),
      goalId: new mongoose.Types.ObjectId(goalId),
      amount,
      date: date ? new Date(date) : new Date(),
    });

    // Update goal's currentAmount
    goal.currentAmount = (goal.currentAmount || 0) + amount;
    await goal.save();

    const depositData = deposit.toObject();
    return NextResponse.json(
      {
        success: true,
        data: {
          _id: String(depositData._id),
          userId: String(depositData.userId),
          goalId: String(depositData.goalId),
          amount: depositData.amount,
          date: depositData.date,
          createdAt: depositData.createdAt,
          updatedAt: depositData.updatedAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/savings/deposits error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create deposit" },
      { status: 500 }
    );
  }
}
