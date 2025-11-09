import dbConnect from "@/app/api/db/dbConnect";
import User from "../../models/User";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET() {
  try {
    await dbConnect();

    // Získání tokenu z cookies
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return new Response(JSON.stringify({ message: "No token provided" }), {
        status: 401,
      });
    }

    // Ověření JWT tokenu
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      username: string;
      email: string;
      userId: string;
    };

    // Nalezení uživatele a ověření, že token existuje v databázi
    const user = await User.findById(decoded.userId);
    if (!user || !user.tokens.includes(token)) {
      return new Response(JSON.stringify({ message: "Invalid token" }), {
        status: 401,
      });
    }

    return new Response(
      JSON.stringify({
        valid: true,
        user: {
          username: user.username,
          email: user.email,
          name: user.name,
          surname: user.surname,
        },
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ message: "Invalid or expired token" }),
      { status: 401 }
    );
  }
}
