-- Update BlogPosts table to support Unicode characters (emojis) and new fields
-- Run this script in your SQL Server Management Studio or database tool

USE [YourDatabaseName]; -- Replace with your actual database name

-- First, check if the table exists and show current structure
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'Iftekhari' AND TABLE_NAME = 'BlogPosts')
BEGIN
    PRINT 'BlogPosts table exists. Updating structure...'
    
    -- Add new columns if they don't exist
    IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'Iftekhari' AND TABLE_NAME = 'BlogPosts' AND COLUMN_NAME = 'category')
    BEGIN
        ALTER TABLE Iftekhari.BlogPosts ADD category NVARCHAR(100) NULL;
        PRINT 'Added category column'
    END
    
    IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'Iftekhari' AND TABLE_NAME = 'BlogPosts' AND COLUMN_NAME = 'tags')
    BEGIN
        ALTER TABLE Iftekhari.BlogPosts ADD tags NVARCHAR(MAX) NULL;
        PRINT 'Added tags column'
    END
    
    IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'Iftekhari' AND TABLE_NAME = 'BlogPosts' AND COLUMN_NAME = 'status')
    BEGIN
        ALTER TABLE Iftekhari.BlogPosts ADD status NVARCHAR(20) DEFAULT 'draft' NOT NULL;
        PRINT 'Added status column'
    END
    
    IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'Iftekhari' AND TABLE_NAME = 'BlogPosts' AND COLUMN_NAME = 'updatedAt')
    BEGIN
        ALTER TABLE Iftekhari.BlogPosts ADD updatedAt DATETIME2 DEFAULT GETDATE() NOT NULL;
        PRINT 'Added updatedAt column'
    END
    
    -- Update existing VARCHAR columns to NVARCHAR for Unicode support
    -- This will preserve existing data while enabling emoji support
    
    -- Check current data types and update if needed
    DECLARE @sql NVARCHAR(MAX) = '';
    
    -- Update title column
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_SCHEMA = 'Iftekhari' AND TABLE_NAME = 'BlogPosts' 
               AND COLUMN_NAME = 'title' AND DATA_TYPE = 'varchar')
    BEGIN
        SET @sql = 'ALTER TABLE Iftekhari.BlogPosts ALTER COLUMN title NVARCHAR(500) NOT NULL;'
        EXEC sp_executesql @sql
        PRINT 'Updated title column to NVARCHAR'
    END
    
    -- Update slug column
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_SCHEMA = 'Iftekhari' AND TABLE_NAME = 'BlogPosts' 
               AND COLUMN_NAME = 'slug' AND DATA_TYPE = 'varchar')
    BEGIN
        SET @sql = 'ALTER TABLE Iftekhari.BlogPosts ALTER COLUMN slug NVARCHAR(500) NOT NULL;'
        EXEC sp_executesql @sql
        PRINT 'Updated slug column to NVARCHAR'
    END
    
    -- Update summary column
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_SCHEMA = 'Iftekhari' AND TABLE_NAME = 'BlogPosts' 
               AND COLUMN_NAME = 'summary' AND DATA_TYPE = 'varchar')
    BEGIN
        SET @sql = 'ALTER TABLE Iftekhari.BlogPosts ALTER COLUMN summary NVARCHAR(1000) NULL;'
        EXEC sp_executesql @sql
        PRINT 'Updated summary column to NVARCHAR'
    END
    
    -- Update content column
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_SCHEMA = 'Iftekhari' AND TABLE_NAME = 'BlogPosts' 
               AND COLUMN_NAME = 'content' AND DATA_TYPE = 'text')
    BEGIN
        SET @sql = 'ALTER TABLE Iftekhari.BlogPosts ALTER COLUMN content NTEXT NULL;'
        EXEC sp_executesql @sql
        PRINT 'Updated content column to NTEXT'
    END
    
    -- Update author column
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_SCHEMA = 'Iftekhari' AND TABLE_NAME = 'BlogPosts' 
               AND COLUMN_NAME = 'author' AND DATA_TYPE = 'varchar')
    BEGIN
        SET @sql = 'ALTER TABLE Iftekhari.BlogPosts ALTER COLUMN author NVARCHAR(255) NOT NULL;'
        EXEC sp_executesql @sql
        PRINT 'Updated author column to NVARCHAR'
    END
    
    -- Update coverImage column
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_SCHEMA = 'Iftekhari' AND TABLE_NAME = 'BlogPosts' 
               AND COLUMN_NAME = 'coverImage' AND DATA_TYPE = 'varchar')
    BEGIN
        SET @sql = 'ALTER TABLE Iftekhari.BlogPosts ALTER COLUMN coverImage NVARCHAR(1000) NULL;'
        EXEC sp_executesql @sql
        PRINT 'Updated coverImage column to NVARCHAR'
    END
    
    PRINT 'BlogPosts table updated successfully for Unicode support!'
    
END
ELSE
BEGIN
    -- Create the table if it doesn't exist
    PRINT 'Creating BlogPosts table with Unicode support...'
    
    CREATE TABLE Iftekhari.BlogPosts (
        id INT IDENTITY(1,1) PRIMARY KEY,
        slug NVARCHAR(500) NOT NULL UNIQUE,
        title NVARCHAR(500) NOT NULL,
        content NTEXT NULL,
        summary NVARCHAR(1000) NULL,
        coverImage NVARCHAR(1000) NULL,
        author NVARCHAR(255) NOT NULL,
        category NVARCHAR(100) NULL,
        tags NVARCHAR(MAX) NULL, -- JSON array of tags
        status NVARCHAR(20) DEFAULT 'draft' NOT NULL,
        createdAt DATETIME2 DEFAULT GETDATE() NOT NULL,
        updatedAt DATETIME2 DEFAULT GETDATE() NOT NULL
    );
    
    -- Create indexes for better performance
    CREATE INDEX IX_BlogPosts_Slug ON Iftekhari.BlogPosts(slug);
    CREATE INDEX IX_BlogPosts_Status ON Iftekhari.BlogPosts(status);
    CREATE INDEX IX_BlogPosts_CreatedAt ON Iftekhari.BlogPosts(createdAt DESC);
    CREATE INDEX IX_BlogPosts_Category ON Iftekhari.BlogPosts(category);
    
    PRINT 'BlogPosts table created successfully with Unicode support!'
END

-- Test Unicode support by inserting a sample blog with emojis
PRINT 'Testing Unicode support...'

-- Insert a test blog with emojis
INSERT INTO Iftekhari.BlogPosts (slug, title, content, summary, author, category, status)
VALUES (
    'test-emoji-support',
    N'🕊️ Test Blog Title with Emojis 🌟',
    N'<p>This is a test blog content with emojis: 🎉 🚀 💡 ❤️</p>',
    N'A test summary with emojis 📝✨',
    N'Test Author 👨‍💻',
    N'Technology',
    'published'
);

-- Verify the data was inserted correctly
SELECT title, summary, author FROM Iftekhari.BlogPosts WHERE slug = 'test-emoji-support';

PRINT 'Unicode test completed. If you see emojis in the output above, Unicode support is working!'

-- Clean up test data (optional - remove this line if you want to keep the test blog)
-- DELETE FROM Iftekhari.BlogPosts WHERE slug = 'test-emoji-support';
