-- Idempotent hotfix: safe on dev/prod repeatedly
SET @exists := (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'Product' AND COLUMN_NAME = 'description'
);
SET @sql := IF(@exists = 0,
  'ALTER TABLE `Product` ADD COLUMN `description` TEXT NULL AFTER `images`',
  'SELECT 1'
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
