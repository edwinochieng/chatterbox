import { Request, Response } from "express";
import prisma from "../prisma/client";

export const searchConversation = async (req: Request, res: Response) => {
  const { friendId } = req.body;
  const userId = req.userId;

  if (!friendId || !userId) {
    return res.status(400).json({ message: "Missing required parameters." });
  }

  try {
    // Search for an existing conversation between user and friend
    let conversation = await prisma.conversation.findFirst({
      where: {
        AND: [
          {
            members: {
              some: { userId: String(userId) },
            },
          },
          {
            members: {
              some: { userId: String(friendId) },
            },
          },
        ],
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
                publicKey: true,
              },
            },
          },
        },
        messages: {
          orderBy: { createdAt: "asc" },
          select: {
            id: true,
            content: true,
            createdAt: true,
            senderId: true,
            iv: true,
            seen: true,
          },
        },
      },
    });

    // If no conversation is found, create a new one
    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          members: {
            createMany: {
              data: [{ userId: String(userId) }, { userId: String(friendId) }],
            },
          },
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
                  publicKey: true,
                },
              },
            },
          },
          messages: true,
        },
      });
    }

    const friend = conversation?.members.find(
      (member) => member.user.id !== String(userId)
    )?.user;

    const lastMessage =
      conversation?.messages[conversation.messages.length - 1] || null;

    const unreadMessagesCount = await prisma.message.count({
      where: {
        conversationId: conversation?.id,
        seen: false,
        senderId: {
          not: String(userId),
        },
      },
    });

    const conversationDetails = {
      id: conversation?.id,
      friend,
      messages: conversation?.messages || [],
      lastMessage,
      unreadMessagesCount,
    };

    return res.status(200).json({
      conversation: conversationDetails,
      message: "Conversation fetched successfully",
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Error creating or retrieving conversation" });
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
                publicKey: true,
              },
            },
          },
        },

        messages: {
          orderBy: { createdAt: "asc" },
          select: {
            id: true,
            content: true,
            createdAt: true,
            senderId: true,
            iv: true,
            seen: true,
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

        const lastMessage =
          conversation.messages[conversation.messages.length - 1];

        const unreadMessagesCount = await prisma.message.count({
          where: {
            conversationId: conversation.id,
            seen: false,
            senderId: {
              not: userId,
            },
          },
        });

        return {
          id: conversation.id,
          friend,
          messages: conversation.messages,
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
