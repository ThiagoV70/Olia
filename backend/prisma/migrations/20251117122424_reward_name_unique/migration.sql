/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `rewards` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "rewards_name_key" ON "rewards"("name");
