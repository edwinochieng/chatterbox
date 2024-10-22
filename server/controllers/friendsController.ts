import { Request, Response } from "express";
import prisma from "../prisma/client";
import { FriendshipStatus } from "@prisma/client";

export const sendFriendRequest = async (req: Request, res: Response) => {
  const { requesteeId } = req.body;
  const userId = req.userId;

  try {
    await prisma.friendship.create({
      data: { requesterId: String(userId), requesteeId: requesteeId },
    });
    return res
      .status(200)
      .json({ message: "Friend request sent successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error sending friend request" });
  }
};

export const acceptFriendRequest = async (req: Request, res: Response) => {
  const { friendshipId } = req.params;

  try {
    await prisma.friendship.update({
      where: { id: friendshipId },
      data: { status: FriendshipStatus.ACCEPTED },
    });
    return res
      .status(200)
      .json({ message: "Friend request accepted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error accepting friend request settings" });
  }
};

export const deleteFriendRequest = async (req: Request, res: Response) => {
  const { friendshipId } = req.params;

  try {
    await prisma.friendship.delete({
      where: { id: friendshipId },
    });
    return res
      .status(200)
      .json({ message: "Friend request deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting friend request" });
  }
};

export const getFriendRequests = async (req: Request, res: Response) => {
  const userId = req.userId;

  try {
    const friendRequests = await prisma.friendship.findMany({
      where: { requesteeId: userId, status: FriendshipStatus.PENDING },
      include: {
        requester: {
          select: {
            id: true,
            fullName: true,
            email: true,
            imageUrl: true,
          },
        },
      },
    });
    return res.status(200).json({
      friendRequests,
      message: "Friend requests fetched successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching friend requests" });
  }
};

export const getFriends = async (req: Request, res: Response) => {
  const userId = req.userId;

  try {
    const friendships = await prisma.friendship.findMany({
      where: {
        OR: [
          { requesterId: userId, status: FriendshipStatus.ACCEPTED },
          { requesteeId: userId, status: FriendshipStatus.ACCEPTED },
        ],
      },
      include: {
        requester: {
          select: {
            id: true,
            fullName: true,
            email: true,
            imageUrl: true,
          },
        },
        requestee: {
          select: {
            id: true,
            fullName: true,
            email: true,
            imageUrl: true,
          },
        },
      },
    });

    const friends = friendships.map((friendship) => {
      if (friendship.requesterId === userId) {
        return friendship.requestee;
      } else {
        return friendship.requester;
      }
    });

    friends.sort((a, b) => a.fullName.localeCompare(b.fullName));

    return res
      .status(200)
      .json({ friends, message: "Friends fetched successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching friends" });
  }
};
