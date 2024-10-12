import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import prisma from "../prisma/client";

export const updateProfileSettings = async (req: Request, res: Response) => {
  const data = req.body;
  const { fullName, bio } = data;
  const userId = req.userId;

  try {
    const updateData: any = { fullName };

    if (bio !== undefined && bio !== "") {
      updateData.bio = bio;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    return res.status(200).json({
      user: updatedUser,
      message: "Profile settings updated successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: "Error updating profile settings" });
  }
};

export const updateAccountSettings = async (req: Request, res: Response) => {
  const data = req.body;
  const { email, password } = data;
  const userId = req.userId;

  try {
    const updateData: any = { email };

    if (password !== undefined && password !== "") {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });
    return res.status(200).json({
      user: updatedUser,
      message: "Account settings updated successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: "Error updating account settings" });
  }
};

export const updateProfilePicture = async (req: Request, res: Response) => {
  const { profilePictureUrl } = req.body;
  const userId = req.userId;

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { imageUrl: profilePictureUrl },
    });
    return res.status(200).json({
      user: updatedUser,
      message: "Profile picture updated successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: "Error updating profile picture" });
  }
};

export const searchUserByEmail = async (req: Request, res: Response) => {
  const { email } = req.query;
  const userId = req.userId;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: String(email),
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const existingFriendship = await prisma.friendship.findFirst({
      where: {
        OR: [
          { requesterId: userId, requesteeId: user.id },
          { requesterId: user.id, requesteeId: userId },
        ],
        status: "accepted",
      },
    });

    const pendingFriendship = await prisma.friendship.findFirst({
      where: {
        requesterId: userId,
        requesteeId: user.id,
        status: "pending",
      },
    });

    return res.status(200).json({
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      profilePicture: user.imageUrl,
      isRequested: !!pendingFriendship,
      isFriend: !!existingFriendship,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error searching for user" });
  }
};

export const searchUserById = async (req: Request, res: Response) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ message: "UserId is required" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: String(userId),
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: "Error searching for user" });
  }
};
