-- Add soft delete functionality to BlogPosts table
-- This script adds a deletedAt column and updates queries to exclude deleted records

-- Add deletedAt column to BlogPosts table
ALTER TABLE Iftekhari.BlogPosts 
ADD deletedAt DATETIME2 NULL;

-- Create index on deletedAt for better query performance
CREATE INDEX IX_BlogPosts_DeletedAt ON Iftekhari.BlogPosts(deletedAt);

-- Create index on combined fields for better performance with soft delete
CREATE INDEX IX_BlogPosts_Status_DeletedAt ON Iftekhari.BlogPosts(status, deletedAt) 
WHERE deletedAt IS NULL;

-- Create view for active (non-deleted) blog posts
CREATE VIEW Iftekhari.ActiveBlogPosts AS
SELECT 
    id, 
    title, 
    slug, 
    content, 
    summary, 
    coverImage, 
    author, 
    authorEmail, 
    category, 
    tags, 
    status, 
    viewCount, 
    commentCount, 
    createdAt, 
    updatedAt
FROM Iftekhari.BlogPosts 
WHERE deletedAt IS NULL;
