import pino from "pino";

const isEdge = process.env.NEXT_RUNTIME === "edge";
const isProduction = process.env.NODE_ENV === "production";
const isTurboRuntime = Boolean(process.env.TURBOPACK || process.env.__NEXT_PRIVATE_PREBUNDLED_REACT);
const shouldUsePrettyTransport = !isEdge && !isProduction && !isTurboRuntime;

const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  transport: shouldUsePrettyTransport
    ? {
        target: "pino-pretty",
        options: {
          colorize: true,
          ignore: "pid,hostname",
          translateTime: "SYS:standard",
        },
      }
    : undefined,
  formatters: {
    level: (label) => ({ level: label.toUpperCase() }),
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});

export default logger;
