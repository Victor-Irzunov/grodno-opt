-- Product.title
SET @ex := (
  SELECT COUNT(*) FROM information_schema.statistics
  WHERE table_schema = DATABASE() AND table_name = 'Product' AND index_name = 'idx_product_title'
);
SET @sql := IF(@ex = 0, 'CREATE INDEX idx_product_title ON `Product` (`title`)', 'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Product.categoryId
SET @ex := (
  SELECT COUNT(*) FROM information_schema.statistics
  WHERE table_schema = DATABASE() AND table_name = 'Product' AND index_name = 'idx_product_categoryId'
);
SET @sql := IF(@ex = 0, 'CREATE INDEX idx_product_categoryId ON `Product` (`categoryId`)', 'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Product.groupId
SET @ex := (
  SELECT COUNT(*) FROM information_schema.statistics
  WHERE table_schema = DATABASE() AND table_name = 'Product' AND index_name = 'idx_product_groupId'
);
SET @sql := IF(@ex = 0, 'CREATE INDEX idx_product_groupId ON `Product` (`groupId`)', 'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Group.title
SET @ex := (
  SELECT COUNT(*) FROM information_schema.statistics
  WHERE table_schema = DATABASE() AND table_name = 'Group' AND index_name = 'idx_group_title'
);
SET @sql := IF(@ex = 0, 'CREATE INDEX idx_group_title ON `Group` (`title`)', 'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
