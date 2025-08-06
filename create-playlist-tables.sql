-- Create Playlist Tables for Music Player
-- Run this script in your SQL Server database

USE [your_database_name];  -- Replace with your actual database name
GO

-- Create Playlists table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[Iftekhari].[Playlists]') AND type in (N'U'))
BEGIN
    CREATE TABLE [Iftekhari].[Playlists] (
        [Id] INT IDENTITY(1,1) PRIMARY KEY,
        [UserId] INT NOT NULL,
        [Name] NVARCHAR(255) NOT NULL,
        [Description] NVARCHAR(MAX) NULL,
        [CoverImage] NVARCHAR(500) NULL,
        [CreatedAt] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        [UpdatedAt] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        [IsDeleted] BIT NOT NULL DEFAULT 0,
        
        -- Foreign key constraint (assuming IftekhariUsers table exists)
        CONSTRAINT [FK_Playlists_Users] FOREIGN KEY ([UserId]) 
            REFERENCES [Iftekhari].[IftekhariUsers] ([Id])
    );
    
    PRINT 'Playlists table created successfully';
END
ELSE
BEGIN
    PRINT 'Playlists table already exists';
END
GO

-- Create PlaylistTracks table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[Iftekhari].[PlaylistTracks]') AND type in (N'U'))
BEGIN
    CREATE TABLE [Iftekhari].[PlaylistTracks] (
        [Id] INT IDENTITY(1,1) PRIMARY KEY,
        [PlaylistId] INT NOT NULL,
        [TrackId] INT NOT NULL,
        [Position] INT NOT NULL,
        [AddedAt] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        
        -- Foreign key constraints
        CONSTRAINT [FK_PlaylistTracks_Playlists] FOREIGN KEY ([PlaylistId]) 
            REFERENCES [Iftekhari].[Playlists] ([Id]) ON DELETE CASCADE,
        CONSTRAINT [FK_PlaylistTracks_Tracks] FOREIGN KEY ([TrackId]) 
            REFERENCES [Iftekhari].[Tracks] ([Id]) ON DELETE CASCADE,
            
        -- Unique constraint to prevent duplicate tracks in same playlist
        CONSTRAINT [UQ_PlaylistTracks_PlaylistTrack] UNIQUE ([PlaylistId], [TrackId])
    );
    
    PRINT 'PlaylistTracks table created successfully';
END
ELSE
BEGIN
    PRINT 'PlaylistTracks table already exists';
END
GO

-- Create indexes for better performance
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Playlists_UserId' AND object_id = OBJECT_ID('Iftekhari.Playlists'))
BEGIN
    CREATE INDEX [IX_Playlists_UserId] ON [Iftekhari].[Playlists] ([UserId]);
    PRINT 'Index IX_Playlists_UserId created';
END

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_PlaylistTracks_PlaylistId' AND object_id = OBJECT_ID('Iftekhari.PlaylistTracks'))
BEGIN
    CREATE INDEX [IX_PlaylistTracks_PlaylistId] ON [Iftekhari].[PlaylistTracks] ([PlaylistId]);
    PRINT 'Index IX_PlaylistTracks_PlaylistId created';
END

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_PlaylistTracks_TrackId' AND object_id = OBJECT_ID('Iftekhari.PlaylistTracks'))
BEGIN
    CREATE INDEX [IX_PlaylistTracks_TrackId] ON [Iftekhari].[PlaylistTracks] ([TrackId]);
    PRINT 'Index IX_PlaylistTracks_TrackId created';
END

PRINT 'Playlist tables setup completed successfully!';
GO
