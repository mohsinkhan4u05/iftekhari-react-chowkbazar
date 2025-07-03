-- Create Bookmarks table for storing user bookmarks
CREATE TABLE Iftekhari.Bookmarks (
    id INT IDENTITY(1,1) PRIMARY KEY,
    userEmail NVARCHAR(255) NOT NULL,
    blogId INT NOT NULL,
    createdAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    
    -- Foreign key constraint
    CONSTRAINT FK_Bookmarks_BlogPosts FOREIGN KEY (blogId) REFERENCES Iftekhari.BlogPosts(id) ON DELETE CASCADE,
    
    -- Unique constraint to prevent duplicate bookmarks
    CONSTRAINT UQ_Bookmarks_UserBlog UNIQUE (userEmail, blogId)
);

-- Create index for better query performance
CREATE INDEX IX_Bookmarks_UserEmail ON Iftekhari.Bookmarks(userEmail);
CREATE INDEX IX_Bookmarks_BlogId ON Iftekhari.Bookmarks(blogId);
CREATE INDEX IX_Bookmarks_CreatedAt ON Iftekhari.Bookmarks(createdAt DESC);
