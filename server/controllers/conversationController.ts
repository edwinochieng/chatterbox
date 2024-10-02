import { Request, Response } from "express";
import prisma from "../prisma/client";

export const searchConversation = async (req: Request, res: Response) => {
  const { friendId } = req.body;
  const userId = req.userId;

  try {
    let conversation = await prisma.conversation.findFirst({
      where: {
        AND: [
          {
            members: {
              some: { userId: userId },
            },
          },
          {
            members: {
              some: { userId: String(friendId) },
            },
          },
        ],
      },
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          members: {
            createMany: {
              data: [{ userId: String(userId) }, { userId: String(friendId) }],
            },
          },
        },
      });
    }

    return res.status(200).json(conversation);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error creating or retrieving conversation" });
  }
};
export const getConversationDetails = async (req: Request, res: Response) => {
  const { conversationId } = req.params;
  const userId = req.userId;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    const conversation = await prisma.conversation.findUnique({
      where: {
        id: String(conversationId),
      },
      include: {
        members: {
          select: {
            user: {
              select: {
                id: true,
                fullName: true,
                email: true,
                imageUrl: true,
                bio: true,
              },
            },
          },
        },
        messages: {
          include: {
            readReceipts: true,
          },
        },
      },
    });

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    const friend = conversation?.members.find(
      (member) => member.user.id !== userId
    )?.user;

    const messagesWithSeenStatus = conversation.messages.map((message) => {
      const seenByUserIds = message.readReceipts.map(
        (receipt) => receipt.userId
      );

      if (message.senderId === userId) {
        return {
          ...message,
          seen: seenByUserIds.includes(friend!.id),
        };
      } else {
        return {
          ...message,
          seen: seenByUserIds.includes(userId),
        };
      }
    });

    return res.status(200).json({
      conversation: {
        ...conversation,
        messages: messagesWithSeenStatus,
      },
      friend,
      message: "Conversation details fetched successfully",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching conversation details" });
  }
};

export const getAllConversations = async (req: Request, res: Response) => {
  const userId = req.userId;

  try {
    const conversations = await prisma.conversation.findMany({
      where: {
        members: { some: { userId: String(userId) } },
      },
      orderBy: {
        updatedAt: "desc",
      },
      include: {
        members: {
          select: {
            user: {
              select: {
                id: true,
                fullName: true,
                imageUrl: true,
              },
            },
          },
        },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1, // latest message
          select: {
            content: true,
            createdAt: true,
          },
        },
        _count: {
          select: {
            messages: true,
          },
        },
      },
    });

    const conversationDetails = await Promise.all(
      conversations.map(async (conversation) => {
        const friend = conversation.members.find(
          (member) => member.user.id !== userId
        )?.user;

        const lastMessage = conversation.messages[0];

        const unreadMessagesCount = await prisma.message.count({
          where: {
            conversationId: conversation.id,
            readReceipts: {
              none: { userId: userId },
            },
            senderId: {
              not: userId,
            },
          },
        });

        return {
          id: conversation.id,
          friend,
          lastMessage,
          unreadMessagesCount,
        };
      })
    );

    return res.status(200).json({
      conversations: conversationDetails,
      message: "Conversations fetched successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching conversations" });
  }
};
