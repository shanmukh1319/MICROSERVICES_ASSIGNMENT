-- Alternative Migration Script: Convert Product Status from String to Numeric
-- Use this if the above script doesn't work due to enum constraints
-- This approach uses a more careful step-by-step process

-- Step 1: Check current status values
SELECT DISTINCT status FROM products;

-- Step 2: Create backup (optional but recommended)
-- CREATE TABLE products_backup AS SELECT * FROM products;

-- Step 3: If status is an enum type, we need to drop and recreate
-- First, check if it's an enum type
SELECT column_name, data_type, udt_name 
FROM information_schema.columns 
WHERE table_name = 'products' AND column_name = 'status';

-- Step 4: If it's an enum, drop the enum constraint first
-- ALTER TABLE products DROP CONSTRAINT IF EXISTS products_status_check;
-- DROP TYPE IF EXISTS productstatus_enum CASCADE;

-- Step 5: Add temporary integer column
ALTER TABLE products ADD COLUMN IF NOT EXISTS status_new INTEGER DEFAULT 1;

-- Step 6: Convert values based on current status
-- This handles both string and enum types
DO $$
BEGIN
    -- Try to convert if status is text/enum
    UPDATE products 
    SET status_new = CASE 
        WHEN status::text = 'ACTIVE' OR status::text = '1' THEN 1
        WHEN status::text = 'INACTIVE' OR status::text = '0' THEN 0
        ELSE 1
    END
    WHERE status_new IS NULL;
EXCEPTION
    WHEN OTHERS THEN
        -- If conversion fails, set all to 1 (ACTIVE)
        UPDATE products SET status_new = 1 WHERE status_new IS NULL;
END $$;

-- Step 7: Drop old status column
ALTER TABLE products DROP COLUMN IF EXISTS status;

-- Step 8: Rename new column
ALTER TABLE products RENAME COLUMN status_new TO status;

-- Step 9: Set constraints
ALTER TABLE products ALTER COLUMN status SET DEFAULT 1;
ALTER TABLE products ALTER COLUMN status SET NOT NULL;
ALTER TABLE products ADD CONSTRAINT check_status_value CHECK (status IN (0, 1));

-- Step 10: Verify
SELECT COUNT(*) as total_products,
       SUM(CASE WHEN status = 1 THEN 1 ELSE 0 END) as active_count,
       SUM(CASE WHEN status = 0 THEN 1 ELSE 0 END) as inactive_count
FROM products;

