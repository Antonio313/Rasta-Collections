import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../lib/jwt";

export interface AuthRequest extends Request {
  user?: {
    userId: number;
    username: string;
  };
}

export function requireAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  const token = req.cookies?.accessToken;

  if (!token) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }

  try {
    const payload = verifyAccessToken(token);
    req.user = payload;
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}
