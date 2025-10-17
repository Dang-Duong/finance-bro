import dbConnect from "@/app/api/db/dbConnect";
import User from "../../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";



export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();
    await dbConnect();

    const user = await User.findOne({ username });
    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return new Response(JSON.stringify({ message: "Invalid credentials" }), { status: 401 });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    return new Response(JSON.stringify({ token, user }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: "Server error" }), { status: 500 });
  }
}
