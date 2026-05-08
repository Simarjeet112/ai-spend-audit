import { Request, Response, NextFunction } from "express";

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error("Unhandled error:", err);
  return res.status(500).json({
    error: "Something went wrong",
    message: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
}
