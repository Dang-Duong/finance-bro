import dbConnect from "../../db/dbConnect";
import User from "../../models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";

const registerSchema = z.object({
  username: z.string().min(2).max(100).trim().toLowerCase(),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { message: "Invalid input", errors: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { username, password } = parsed.data;

    await dbConnect();

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      password: hashedPassword,
    });

    const maybe = newUser as unknown as {
      toObject?: () => Record<string, unknown>;
    };
    const userObj =
      maybe.toObject && typeof maybe.toObject === "function"
        ? maybe.toObject()
        : (newUser as unknown as Record<string, unknown>);
    const userSafe: Record<string, unknown> = { ...userObj };
    if ("password" in userSafe) delete userSafe["password"];

    return NextResponse.json(
      { message: "User registered", user: userSafe },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
