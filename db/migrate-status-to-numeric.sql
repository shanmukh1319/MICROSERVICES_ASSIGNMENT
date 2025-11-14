-- Migration Script: Convert Product Status from String to Numeric
-- This script converts existing status values from 'ACTIVE'/'INACTIVE' to 1/0
-- Run this script after updating the code to use numeric status

-- Step 1: Add a temporary column to store numeric status
ALTER TABLE products ADD COLUMN IF NOT EXISTS status_temp INTEGER;

-- Step 2: Convert existing status values
-- If status is stored as enum/text, convert 'ACTIVE' to 1 and 'INACTIVE' to 0
UPDATE products 
SET status_temp = CASE 
    WHEN status::text = 'ACTIVE' THEN 1
    WHEN status::text = 'INACTIVE' THEN 0
    ELSE 1  -- Default to ACTIVE if unknown value
END;

-- Step 3: Drop the old status column
ALTER TABLE products DROP COLUMN IF EXISTS status;

-- Step 4: Rename the temporary column to status
ALTER TABLE products RENAME COLUMN status_temp TO status;

-- Step 5: Set default value and NOT NULL constraint
ALTER TABLE products ALTER COLUMN status SET DEFAULT 1;
ALTER TABLE products ALTER COLUMN status SET NOT NULL;

-- Step 6: Add check constraint to ensure only 0 or 1
ALTER TABLE products ADD CONSTRAINT check_status_value CHECK (status IN (0, 1));

-- Verify the migration
SELECT id, sku, name, status, 
       CASE 
           WHEN status = 1 THEN 'ACTIVE'
           WHEN status = 0 THEN 'INACTIVE'
           ELSE 'UNKNOWN'
       END as status_text
FROM products
LIMIT 10;

