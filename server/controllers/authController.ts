import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { loginSchema, signupSchema } from "../validators/userValidator";
import z from "zod";
import prisma from "../prisma/client";

const createAccessToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET as string, {
    expiresIn: "1h",
  });
};

const createRefreshToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET as string, {
    expiresIn: "7d",
  });
};

export const signup = async (req: Request, res: Response) => {
  try {
    const validatedData = signupSchema.parse(req.body);

    const { fullName, email, password } = validatedData;

    let user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user = await prisma.user.create({
      data: {
        fullName,
        email,
        password: hashedPassword,
      },
    });

    const accessToken = createAccessToken(user.id);
    const refreshToken = createRefreshToken(user.id);

    const userData = {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      imageUrl: user.imageUrl,
      bio: user.bio,
      publicKey: user.publicKey,
    };

    return res
      .status(201)
      .json({ user: userData, tokens: { accessToken, refreshToken } });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    return res.status(500).send("Server error");
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const validatedData = loginSchema.parse(req.body);

    const { email, password } = validatedData;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const accessToken = createAccessToken(user.id);
    const refreshToken = createRefreshToken(user.id);

    const userData = {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      imageUrl: user.imageUrl,
      bio: user.bio,
      publicKey: user.publicKey,
    };

    return res
      .status(200)
      .json({ user: userData, tokens: { accessToken, refreshToken } });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }

    return res.status(500).send("Server error");
  }
};

export const refreshAccessToken = (req: Request, res: Response) => {
  const refreshToken = req.body.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ msg: "Refresh token missing" });
  }

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET as string
    ) as { userId: string };

    const newAccessToken = createAccessToken(decoded.userId);
    const newRefreshToken = createRefreshToken(decoded.userId);

    return res
      .status(200)
      .json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  } catch (err) {
    return res.status(403).json({ msg: "Invalid refresh token" });
  }
};
