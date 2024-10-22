import prisma from "../prisma/client";

export const markMessageAsSeen = async (messageId: string) => {
  try {
    const unseenMessage = await prisma.message.findUnique({
      where: {
        id: messageId,
      },
    });

    if (unseenMessage && !unseenMessage.seen) {
      await prisma.message.update({
        where: {
          id: messageId,
        },
        data: {
          seen: true,
        },
      });
    }
  } catch (error) {
    console.error("Error marking message as seen:", error);
    throw error;
  }
};
