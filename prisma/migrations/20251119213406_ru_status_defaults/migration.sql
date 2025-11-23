-- AlterTable
ALTER TABLE `Order` MODIFY `status` VARCHAR(191) NOT NULL DEFAULT 'В ожидании',
    MODIFY `deliveryStatus` VARCHAR(191) NOT NULL DEFAULT 'В обработке';

-- AlterTable
ALTER TABLE `Return` MODIFY `status` VARCHAR(191) NOT NULL DEFAULT 'В ожидании';
