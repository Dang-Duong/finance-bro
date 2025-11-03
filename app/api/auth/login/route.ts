import dbConnect from "@/app/api/db/dbConnect";
import User from "../../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";



export async function POST(req: Request) {
  try {
    const { username, email, password } = await req.json();
    await dbConnect();

    // Support both username and email login
    let user;
    if (email) {
      user = await User.findOne({ email });
    } else if (username) {
      user = await User.findOne({ username });
    } else {
      return new Response(JSON.stringify({ message: "Email or username required" }), { status: 400 });
    }

    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return new Response(JSON.stringify({ message: "Invalid credentials" }), { status: 401 });
    }

    const token = jwt.sign(
      { username: user.username, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    return new Response(JSON.stringify({ token, user: { username: user.username, role: user.role } }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: "Server error" }), { status: 500 });
  }
}
