import { NextResponse } from "next/server";
import dbConnect from "../db/dbConnect";
import Budget from "../models/Budget";
import Transaction from "../models/Transaction";
import { authenticateUser } from "../auth/middleware";
import Category from "../models/Category";

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

    const url = new URL(request.url);
    const monthParam = url.searchParams.get("month");
    const yearParam = url.searchParams.get("year");

    const query: Record<string, unknown> = { userId: authUser.userId };
    const parsedMonth = monthParam !== null ? parseInt(monthParam) : undefined;
    const parsedYear = yearParam !== null ? parseInt(yearParam) : undefined;

    if (parsedMonth !== undefined && !Number.isNaN(parsedMonth)) {
      query.month = parsedMonth;
    }
    if (parsedYear !== undefined && !Number.isNaN(parsedYear)) {
      query.year = parsedYear;
    }

    const budgets = await Budget.find(query)
      .populate("category", "name")
      .populate("userId", "username");

    const budgetsWithSpent = await Promise.all(
      budgets.map(async (budget) => {
        const startDate = new Date(budget.year, budget.month, 1);
        const endDate = new Date(budget.year, budget.month + 1, 0);

        const transactions = await Transaction.find({
          userId: authUser.userId,
          category: budget.category._id,
          date: {
            $gte: startDate,
            $lte: endDate,
          },
          incoming: false,
        });

        const spent = transactions.reduce((sum, t) => sum + t.amount, 0);

        return {
          ...budget.toObject(),
          spent,
          progress: budget.amount > 0 ? (spent / budget.amount) * 100 : 0,
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: budgetsWithSpent,
    });
  } catch (error) {
    console.error("GET /api/budgets error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch budgets" },
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
    const { category, amount, month, year } = body;

    if (!category || !amount || month === undefined || !year) {
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

    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return NextResponse.json(
        { success: false, error: "Category not found" },
        { status: 404 }
      );
    }

    const existingBudget = await Budget.findOne({
      userId: authUser.userId,
      category,
      month,
      year,
    });

    if (existingBudget) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Budget already exists for this category in the selected month",
        },
        { status: 400 }
      );
    }

    const budget = await Budget.create({
      userId: authUser.userId,
      category,
      amount,
      month,
      year,
    });

    const populatedBudget = await Budget.findById(budget._id)
      .populate("category", "name")
      .populate("userId", "username");

    return NextResponse.json(
      {
        success: true,
        message: "Budget created successfully",
        data: {
          ...populatedBudget?.toObject(),
          spent: 0,
          progress: 0,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/budgets error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create budget" },
      { status: 500 }
    );
  }
}
