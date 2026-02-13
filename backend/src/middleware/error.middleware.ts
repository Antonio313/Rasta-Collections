import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message);
    this.name = "AppError";
  }
}

/** Safely parse a route param to an integer. Throws AppError if invalid. */
export function parseId(param: string | string[] | undefined, label = "ID"): number {
  const raw = Array.isArray(param) ? param[0] : param;
  const id = parseInt(raw ?? "");
  if (isNaN(id)) throw new AppError(400, `Invalid ${label}`);
  return id;
}

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }

  if (err instanceof ZodError) {
    const messages = err.errors.map((e) => e.message);
    res.status(400).json({ error: "Validation error", data: messages });
    return;
  }

  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
}
