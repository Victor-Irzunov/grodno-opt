/*
  Warnings:

  - You are about to alter the column `price` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(12,3)`.

*/
-- AlterTable
ALTER TABLE `Product` MODIFY `price` DECIMAL(12, 3) NOT NULL;
