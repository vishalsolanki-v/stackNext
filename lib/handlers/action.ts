"use server";

import { Session } from "next-auth";
import { ZodError, ZodSchema } from "zod";

import { auth } from "@/auth";

import { UnauthorizedError, ValidationError } from "../http-errors";
import dbConnect from "../mongoose";

type ActionOptions<T> = {
  params?: T;
  schema?: ZodSchema<T>;
  authorize?: boolean;
  allowOffline?: boolean;
};

// 1. Checking whether the schema and params are provided and validated.
// 2. Checking whether the user is authorized.
// 3. Connecting to the database.
// 4. Returning the params and session.

async function action<T>({
  params,
  schema,
  authorize = false,
  allowOffline = false,
}: ActionOptions<T>) {
  if (schema && params) {
    try {
      schema.parse(params);
    } catch (error) {
      if (error instanceof ZodError) {
        return new ValidationError(
          error.flatten().fieldErrors as Record<string, string[]>
        );
      } else {
        return new Error("Schema validation failed");
      }
    }
  }

  let session: Session | null = null;

  if (authorize) {
    try {
      session = await auth();
    } catch {
      return new Error("Unable to verify your session. Please try again.");
    }

    if (!session) {
      return new UnauthorizedError();
    }
  }

  try {
    await dbConnect();
  } catch {
    if (!allowOffline) {
      return new Error("Database is unavailable. Please try again later.");
    }

    return { params, session, dbAvailable: false };
  }

  return { params, session, dbAvailable: true };
}

export default action;
