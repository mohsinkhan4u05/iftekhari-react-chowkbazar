-- Create BlogComments table for blog comment functionality
-- Run this script in your SQL Server Management Studio or database tool

USE [YourDatabaseName]; -- Replace with your actual database name

-- Create BlogComments table if it doesn't exist
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES 
               WHERE TABLE_SCHEMA = 'Iftekhari' 
               AND TABLE_NAME = 'BlogComments')
BEGIN
    CREATE TABLE Iftekhari.BlogComments (
        id INT IDENTITY(1,1) PRIMARY KEY,
        blogPostId INT NOT NULL,
        parentCommentId INT NULL, -- For reply functionality
        authorName NVARCHAR(255) NOT NULL,
        authorEmail NVARCHAR(255) NOT NULL,
        content NTEXT NOT NULL,
        status NVARCHAR(20) DEFAULT 'pending' NOT NULL, -- pending, approved, rejected
        createdAt DATETIME2 DEFAULT GETDATE() NOT NULL,
        updatedAt DATETIME2 DEFAULT GETDATE() NOT NULL,
        
        -- Foreign key constraints
        CONSTRAINT FK_BlogComments_BlogPost 
            FOREIGN KEY (blogPostId) REFERENCES Iftekhari.BlogPosts(id) 
            ON DELETE CASCADE,
        CONSTRAINT FK_BlogComments_Parent 
            FOREIGN KEY (parentCommentId) REFERENCES Iftekhari.BlogComments(id)
    );
    
    -- Create indexes for better performance
    CREATE INDEX IX_BlogComments_BlogPostId ON Iftekhari.BlogComments(blogPostId);
    CREATE INDEX IX_BlogComments_Status ON Iftekhari.BlogComments(status);
    CREATE INDEX IX_BlogComments_CreatedAt ON Iftekhari.BlogComments(createdAt DESC);
    CREATE INDEX IX_BlogComments_ParentId ON Iftekhari.BlogComments(parentCommentId);
    
    PRINT 'BlogComments table created successfully!';
END
ELSE
BEGIN
    PRINT 'BlogComments table already exists';
END

-- Add commentCount column to BlogPosts table if it doesn't exist
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_SCHEMA = 'Iftekhari' 
               AND TABLE_NAME = 'BlogPosts' 
               AND COLUMN_NAME = 'commentCount')
BEGIN
    ALTER TABLE Iftekhari.BlogPosts ADD commentCount INT DEFAULT 0 NOT NULL;
    PRINT 'Added commentCount column to BlogPosts table';
    
    -- Update existing posts with current comment counts
    UPDATE bp 
    SET commentCount = (
        SELECT COUNT(*) 
        FROM Iftekhari.BlogComments bc 
        WHERE bc.blogPostId = bp.id 
        AND bc.status = 'approved'
    )
    FROM Iftekhari.BlogPosts bp;
    
    PRINT 'Updated existing blog posts with comment counts';
END

-- Show sample of table structure
SELECT TOP 0 * FROM Iftekhari.BlogComments;
PRINT 'BlogComments table structure ready!';
