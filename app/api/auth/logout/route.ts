import dbConnect from "@/app/api/db/dbConnect";
import User from "../../models/User";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST() {
  try {
    await dbConnect();

    // Získání tokenu z cookies
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (token) {
      // Ověření a dekódování tokenu
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
          userId: string;
        };

        // Odstranění tokenu z databáze
        await User.findByIdAndUpdate(decoded.userId, {
          $pull: { tokens: token },
        });
      } catch (error) {
        console.error("Token verification failed during logout:", error);
      }
    }

    // Vytvoření response
    const response = new Response(
      JSON.stringify({ message: "Logged out successfully" }),
      { status: 200 }
    );

    // Smazání cookies
    const isProduction = process.env.NODE_ENV === "production";
    const secureFlag = isProduction ? "Secure;" : "";

    response.headers.append(
      "Set-Cookie",
      `token=; HttpOnly; ${secureFlag} SameSite=Strict; Max-Age=0; Path=/`
    );
    response.headers.append(
      "Set-Cookie",
      `user=; ${secureFlag} SameSite=Strict; Max-Age=0; Path=/`
    );

    return response;
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: "Server error" }), {
      status: 500,
    });
  }
}
