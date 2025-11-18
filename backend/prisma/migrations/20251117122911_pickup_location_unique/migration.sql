/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `pickup_locations` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "pickup_locations_name_key" ON "pickup_locations"("name");
