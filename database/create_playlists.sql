-- Create Playlists table
CREATE TABLE [Iftekhari].[Playlists] (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(255) NOT NULL,
    description NVARCHAR(MAX),
    coverImageUrl NVARCHAR(500),
    userId NVARCHAR(255) NOT NULL, -- Store user ID from authentication
    isPublic BIT DEFAULT 1, -- 1 = public, 0 = private
    totalTracks INT DEFAULT 0,
    totalDuration INT DEFAULT 0, -- in seconds
    createdAt DATETIME2 DEFAULT GETDATE(),
    updatedAt DATETIME2 DEFAULT GETDATE(),
    isActive BIT DEFAULT 1
);

-- Create PlaylistTracks junction table for many-to-many relationship
CREATE TABLE [Iftekhari].[PlaylistTracks] (
    id INT IDENTITY(1,1) PRIMARY KEY,
    playlistId INT NOT NULL,
    trackId INT NOT NULL,
    addedAt DATETIME2 DEFAULT GETDATE(),
    addedBy NVARCHAR(255) NOT NULL, -- User who added the track
    position INT DEFAULT 0, -- Track position in playlist
    FOREIGN KEY (playlistId) REFERENCES [Iftekhari].[Playlists](id) ON DELETE CASCADE,
    FOREIGN KEY (trackId) REFERENCES [Iftekhari].[Tracks](id) ON DELETE CASCADE,
    UNIQUE(playlistId, trackId) -- Prevent duplicate tracks in same playlist
);

-- Create indexes for better performance
CREATE INDEX IX_Playlists_UserId ON [Iftekhari].[Playlists](userId);
CREATE INDEX IX_Playlists_IsActive ON [Iftekhari].[Playlists](isActive);
CREATE INDEX IX_PlaylistTracks_PlaylistId ON [Iftekhari].[PlaylistTracks](playlistId);
CREATE INDEX IX_PlaylistTracks_TrackId ON [Iftekhari].[PlaylistTracks](trackId);
CREATE INDEX IX_PlaylistTracks_Position ON [Iftekhari].[PlaylistTracks](position);

-- Create trigger to update totalTracks and totalDuration when tracks are added/removed
CREATE TRIGGER [Iftekhari].[TR_PlaylistTracks_UpdatePlaylistStats]
ON [Iftekhari].[PlaylistTracks]
AFTER INSERT, DELETE, UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Update playlist stats for affected playlists
    UPDATE p
    SET 
        totalTracks = (
            SELECT COUNT(*) 
            FROM [Iftekhari].[PlaylistTracks] pt
            WHERE pt.playlistId = p.id
        ),
        totalDuration = (
            SELECT COALESCE(SUM(t.duration), 0)
            FROM [Iftekhari].[PlaylistTracks] pt
            INNER JOIN [Iftekhari].[Tracks] t ON pt.trackId = t.id
            WHERE pt.playlistId = p.id AND t.isActive = 1
        ),
        updatedAt = GETDATE()
    FROM [Iftekhari].[Playlists] p
    WHERE p.id IN (
        SELECT playlistId FROM inserted
        UNION
        SELECT playlistId FROM deleted
    );
END; 