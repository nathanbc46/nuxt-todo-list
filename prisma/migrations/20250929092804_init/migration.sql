/*
  Warnings:

  - Added the required column `userId` to the `TodoList` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."TodoList" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."account" ALTER COLUMN "createdAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "public"."session" ALTER COLUMN "createdAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "public"."user" ALTER COLUMN "emailVerified" DROP DEFAULT,
ALTER COLUMN "createdAt" DROP DEFAULT,
ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "public"."verification" ALTER COLUMN "createdAt" DROP NOT NULL,
ALTER COLUMN "createdAt" DROP DEFAULT,
ALTER COLUMN "updatedAt" DROP NOT NULL,
ALTER COLUMN "updatedAt" DROP DEFAULT;

-- CreateTable
CREATE TABLE "public"."TodoListItem" (
    "id" TEXT NOT NULL,
    "todoListId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "done" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "TodoListItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."TodoList" ADD CONSTRAINT "TodoList_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TodoListItem" ADD CONSTRAINT "TodoListItem_todoListId_fkey" FOREIGN KEY ("todoListId") REFERENCES "public"."TodoList"("id") ON DELETE CASCADE ON UPDATE CASCADE;
