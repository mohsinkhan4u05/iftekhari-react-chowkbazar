-- Migration Script: Add authorEmail column to BlogPosts table
-- Execute this script in your SQL Server Management Studio or equivalent

-- Check if the column already exists before adding it
IF NOT EXISTS (
    SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = 'Iftekhari' 
    AND TABLE_NAME = 'BlogPosts' 
    AND COLUMN_NAME = 'authorEmail'
)
BEGIN
    -- Add the authorEmail column
    ALTER TABLE Iftekhari.BlogPosts
    ADD authorEmail NVARCHAR(255) NULL;
    
    PRINT 'authorEmail column added successfully to Iftekhari.BlogPosts table';
END
ELSE
BEGIN
    PRINT 'authorEmail column already exists in Iftekhari.BlogPosts table';
END

-- Optional: Update existing records with author email (if you have this data available)
-- You can uncomment and modify the following lines if needed:

-- UPDATE Iftekhari.BlogPosts 
-- SET authorEmail = 'admin@yoursite.com' 
-- WHERE authorEmail IS NULL AND author = 'Admin';

-- UPDATE Iftekhari.BlogPosts 
-- SET authorEmail = 'user@yoursite.com' 
-- WHERE authorEmail IS NULL AND author = 'User';

PRINT 'Migration completed successfully!';
