import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import prisma from "../prisma/client";

export const updateProfileSettings = async (req: Request, res: Response) => {
  const { fullName, bio } = req.body;
  const userId = req.userId;

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { fullName, bio },
    });
    return res
      .status(200)
      .json({ message: "Profile settings updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error updating profile settings" });
  }
};

export const updateAccountSettings = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const userId = req.userId;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { email, password: hashedPassword },
    });
    return res
      .status(200)
      .json({ message: "Account settings updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error updating account settings" });
  }
};

export const updateProfilePicture = async (req: Request, res: Response) => {
  const { profilePictureUrl } = req.body;
  const userId = req.userId;

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { imageUrl: profilePictureUrl },
    });
    return res
      .status(200)
      .json({ message: "Profile picture updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error updating profile picture" });
  }
};
