import { NextResponse } from "next/server";
import dbConnect from "../../../db/dbConnect";
import Transaction from "../../../models/Transaction";
import User from "../../../models/User";
import { authenticateUser } from "../../../auth/middleware";
import mongoose from "mongoose";

function getNextOccurrenceDate(
  lastDate: Date,
  frequency: "weekly" | "monthly" | "yearly"
): Date {
  const nextDate = new Date(lastDate);

  switch (frequency) {
    case "weekly":
      nextDate.setDate(nextDate.getDate() + 7);
      break;
    case "monthly":
      nextDate.setMonth(nextDate.getMonth() + 1);
      break;
    case "yearly":
      nextDate.setFullYear(nextDate.getFullYear() + 1);
      break;
  }

  return nextDate;
}

function shouldGenerateNextInstance(
  lastGeneratedDate: Date | undefined,
  frequency: "weekly" | "monthly" | "yearly",
  originalDate: Date
): boolean {
  const now = new Date();
  const baseDate = lastGeneratedDate || originalDate;
  const nextOccurrence = getNextOccurrenceDate(baseDate, frequency);

  return nextOccurrence <= now;
}

export async function POST() {
  try {
    const authUser = await authenticateUser();
    if (!authUser) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();

    const recurringTransactions = await Transaction.find({
      userId: authUser.userId,
      isRepeating: true,
      $or: [{ parentTransactionId: { $exists: false } }, { parentTransactionId: null }],
    });

    const generatedTransactions = [];
    const user = await User.findById(authUser.userId);

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    for (const recurringTx of recurringTransactions) {
      if (!recurringTx.frequency) continue;

      if (
        shouldGenerateNextInstance(
          recurringTx.lastGeneratedDate,
          recurringTx.frequency,
          recurringTx.date
        )
      ) {
        const baseDate = recurringTx.lastGeneratedDate || recurringTx.date;
        const nextDate = getNextOccurrenceDate(baseDate, recurringTx.frequency);

        const newTransaction = await Transaction.create({
          userId: recurringTx.userId,
          amount: recurringTx.amount,
          description: recurringTx.description,
          incoming: recurringTx.incoming,
          date: nextDate,
          category: recurringTx.category,
          state: recurringTx.state,
          isRepeating: false,
          parentTransactionId: recurringTx._id,
        });

        (user.transactions as mongoose.Types.ObjectId[]).push(
          newTransaction._id as mongoose.Types.ObjectId
        );

        recurringTx.lastGeneratedDate = nextDate;
        await recurringTx.save();

        generatedTransactions.push(newTransaction);
      }
    }

    await user.save();

    const populatedTransactions = await Transaction.find({
      _id: { $in: generatedTransactions.map((tx) => tx._id) },
    })
      .populate("category", "name")
      .populate("userId", "username")
      .populate("parentTransactionId", "description amount");

    return NextResponse.json(
      {
        success: true,
        data: populatedTransactions,
        count: generatedTransactions.length,
        message: `Generated ${generatedTransactions.length} recurring transaction(s)`,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/transactions/recurring/generate error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate recurring transactions" },
      { status: 500 }
    );
  }
}
