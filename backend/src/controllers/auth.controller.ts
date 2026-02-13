import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../lib/jwt";
import { loginSchema } from "@rasta/shared";
import { AppError } from "../middleware/error.middleware";

const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days

function setTokenCookies(res: Response, userId: number, username: string) {
  const accessToken = generateAccessToken({ userId, username });
  const refreshToken = generateRefreshToken({ userId, username });

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: REFRESH_TOKEN_MAX_AGE,
    path: "/api/auth",
  });
}

export async function login(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { username, password } = loginSchema.parse(req.body);

    const user = await prisma.adminUser.findUnique({ where: { username } });

    if (!user) {
      throw new AppError(401, "Invalid username or password");
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash);

    if (!validPassword) {
      throw new AppError(401, "Invalid username or password");
    }

    setTokenCookies(res, user.id, user.username);

    res.json({
      data: { id: user.id, username: user.username },
      message: "Login successful",
    });
  } catch (err) {
    next(err);
  }
}

export async function logout(
  _req: Request,
  res: Response
): Promise<void> {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken", { path: "/api/auth" });
  res.json({ message: "Logged out successfully" });
}

export async function refresh(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const token = req.cookies?.refreshToken;

    if (!token) {
      throw new AppError(401, "No refresh token provided");
    }

    const payload = verifyRefreshToken(token);

    // Verify user still exists
    const user = await prisma.adminUser.findUnique({
      where: { id: payload.userId },
    });

    if (!user) {
      throw new AppError(401, "User no longer exists");
    }

    setTokenCookies(res, user.id, user.username);

    res.json({
      data: { id: user.id, username: user.username },
      message: "Token refreshed",
    });
  } catch (err) {
    next(err);
  }
}
