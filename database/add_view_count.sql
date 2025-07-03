-- Add viewCount column to BlogPosts table
-- Run this script in your SQL Server Management Studio or database tool

USE [YourDatabaseName]; -- Replace with your actual database name

-- Add viewCount column if it doesn't exist
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_SCHEMA = 'Iftekhari' 
               AND TABLE_NAME = 'BlogPosts' 
               AND COLUMN_NAME = 'viewCount')
BEGIN
    ALTER TABLE Iftekhari.BlogPosts ADD viewCount INT DEFAULT 0 NOT NULL;
    PRINT 'Added viewCount column to BlogPosts table';
END
ELSE
BEGIN
    PRINT 'viewCount column already exists';
END

-- Create index for better performance on view count queries
IF NOT EXISTS (SELECT * FROM sys.indexes 
               WHERE name = 'IX_BlogPosts_ViewCount' 
               AND object_id = OBJECT_ID('Iftekhari.BlogPosts'))
BEGIN
    CREATE INDEX IX_BlogPosts_ViewCount ON Iftekhari.BlogPosts(viewCount DESC);
    PRINT 'Created index on viewCount column';
END

-- Update existing posts to have 0 view count if NULL
UPDATE Iftekhari.BlogPosts 
SET viewCount = 0 
WHERE viewCount IS NULL;

PRINT 'View count setup completed successfully!';

-- Show sample of updated structure
SELECT TOP 5 
    id, title, slug, viewCount, status, createdAt 
FROM Iftekhari.BlogPosts 
ORDER BY createdAt DESC;
