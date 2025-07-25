/*
  Warnings:

  - A unique constraint covering the columns `[name,userId]` on the table `Skill` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Skill_name_userId_key" ON "Skill"("name", "userId");
