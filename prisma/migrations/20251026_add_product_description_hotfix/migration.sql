-- my-app/prisma/migrations/20251026_add_product_description_hotfix/migration.sql
-- Idempotent hotfix: безопасно выполнять много раз

-- Проверяем наличие таблицы `product`
SET @table_exists := (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.TABLES
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'product'
);

-- Проверяем наличие колонки `description` в таблице `product`
SET @column_exists := (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'product'
    AND COLUMN_NAME = 'description'
);

-- Если таблица есть И колонки ещё нет — добавляем
SET @sql := IF(
  @table_exists = 1 AND @column_exists = 0,
  'ALTER TABLE `product` ADD COLUMN `description` TEXT NULL AFTER `images`',
  'SELECT 1'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
