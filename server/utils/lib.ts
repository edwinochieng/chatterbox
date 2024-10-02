import prisma from "../prisma/client";

export const markMessageAsSeen = async (messageId: string, userId: string) => {
  try {
    const existingReceipt = await prisma.readReceipt.findUnique({
      where: {
        userId_messageId: {
          userId: userId,
          messageId: messageId,
        },
      },
    });

    if (!existingReceipt) {
      await prisma.readReceipt.create({
        data: {
          userId: userId,
          messageId: messageId,
        },
      });
    }
  } catch (error) {
    console.error("Error marking message as seen:", error);
    throw error;
  }
};
