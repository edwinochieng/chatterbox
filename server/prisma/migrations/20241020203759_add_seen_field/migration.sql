/*
  Warnings:

  - You are about to drop the `ReadReceipt` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `seen` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ReadReceipt" DROP CONSTRAINT "ReadReceipt_messageId_fkey";

-- DropForeignKey
ALTER TABLE "ReadReceipt" DROP CONSTRAINT "ReadReceipt_userId_fkey";

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "seen" BOOLEAN NOT NULL;

-- DropTable
DROP TABLE "ReadReceipt";
