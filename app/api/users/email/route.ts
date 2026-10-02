import { NextResponse } from "next/server";

import User from "@/database/user.model";
import { findFallbackUserByEmail } from "@/lib/fallback-data";
import handleError from "@/lib/handlers/error";
import { NotFoundError, ValidationError } from "@/lib/http-errors";
import dbConnect, { isDatabaseUnavailableError } from "@/lib/mongoose";
import { UserSchema } from "@/lib/validations";

export async function POST(request: Request) {
  let email: unknown;
  try {
    const body = await request.json();
    email = body?.email;

    const validatedData = UserSchema.pick({ email: true }).safeParse({ email });

    if (!validatedData.success)
      throw new ValidationError(validatedData.error.flatten().fieldErrors);

    await dbConnect();

    const user = await User.findOne({ email: validatedData.data.email });
    if (!user) throw new NotFoundError("User");

    return NextResponse.json(
      {
        success: true,
        data: user,
      },
      { status: 200 }
    );
  } catch (error) {
    if (isDatabaseUnavailableError(error) && typeof email === "string") {
      const user = findFallbackUserByEmail(email);
      if (user) {
        return NextResponse.json({ success: true, data: user }, { status: 200 });
      }
    }
    return handleError(error, "api") as APIErrorResponse;
  }
}
