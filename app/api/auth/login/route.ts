import dbConnect from "@/app/api/db/dbConnect";
import User from "../../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    await dbConnect();

    const user = await User.findOne({ email });
    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return new Response(JSON.stringify({ message: "Invalid credentials" }), {
        status: 401,
      });
    }

    const token = jwt.sign(
      { username: user.username, email: user.email, userId: String(user._id) },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    user.tokens.push(token);
    await user.save();

    const response = new Response(
      JSON.stringify({
        message: "Login successful",
        user: {
          username: user.username,
          email: user.email,
          name: user.name,
          surname: user.surname,
        },
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const isProduction = process.env.NODE_ENV === "production";
    const secureFlag = isProduction ? "Secure;" : "";

    response.headers.append(
      "Set-Cookie",
      `token=${token}; HttpOnly; ${secureFlag} SameSite=Strict; Max-Age=${
        7 * 24 * 60 * 60
      }; Path=/`
    );

    response.headers.append(
      "Set-Cookie",
      `user=${encodeURIComponent(
        JSON.stringify({ username: user.username, email: user.email })
      )}; ${secureFlag} SameSite=Strict; Max-Age=${7 * 24 * 60 * 60}; Path=/`
    );

    return response;
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: "Server error" }), {
      status: 500,
    });
  }
}
