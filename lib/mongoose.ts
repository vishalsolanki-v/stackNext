import mongoose, { Mongoose } from "mongoose";

import logger from "./logger";
import "@/database";

const MONGODB_URI = process.env.MONGODB_URI as string;
const DATABASE_UNAVAILABLE_MESSAGE =
  "Database is unavailable. Please try again later.";

export const isDatabaseUnavailableError = (error: unknown): boolean => {
  if (!(error instanceof Error)) return false;
  if (error.message === DATABASE_UNAVAILABLE_MESSAGE) return true;

  return (
    /buffering timed out|server selection|network error|connection (?:closed|lost|refused)|topology.*closed/i.test(
      `${error.name}: ${error.message}`
    ) || isDatabaseUnavailableError(error.cause)
  );
};

interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const dbConnect = async (): Promise<Mongoose> => {
  if (!MONGODB_URI) {
    throw new Error(DATABASE_UNAVAILABLE_MESSAGE);
  }

  if (cached.conn) {
    logger.info("Using existing mongoose connection");
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        dbName: "devflow",
        serverSelectionTimeoutMS: 5000,
      })
      .then((result) => {
        logger.info("Connected to MongoDB");
        return result;
      })
      .catch((error) => {
        logger.error("Error connecting to MongoDB", error);
        cached.promise = null;
        throw new Error(DATABASE_UNAVAILABLE_MESSAGE, { cause: error });
      });
  }

  cached.conn = await cached.promise;

  return cached.conn;
};

export default dbConnect;
