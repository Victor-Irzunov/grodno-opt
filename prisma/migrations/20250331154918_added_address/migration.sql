/*
  Warnings:

  - Added the required column `address` to the `UserData` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `UserData` ADD COLUMN `address` VARCHAR(191) NOT NULL;
