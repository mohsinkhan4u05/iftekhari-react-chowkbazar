CREATE TABLE [Iftekhari].[Tracks](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[title] [nvarchar](255) NOT NULL,
	[artist] [nvarchar](255) NOT NULL,
	[albumId] [int] NULL,
	[genre] [nvarchar](100) NOT NULL,
	[duration] [int] NOT NULL,
	[durationFormatted]  AS (case when [duration]>=(3600) then (((CONVERT([varchar],[duration]/(3600))+':')+right('0'+CONVERT([varchar],([duration]%(3600))/(60)),(2)))+':')+right('0'+CONVERT([varchar],[duration]%(60)),(2)) else (CONVERT([varchar],[duration]/(60))+':')+right('0'+CONVERT([varchar],[duration]%(60)),(2)) end),
	[trackNumber] [int] NULL,
	[audioUrl] [nvarchar](500) NULL,
	[coverImage] [nvarchar](500) NULL,
	[description] [ntext] NULL,
	[lyrics] [ntext] NULL,
	[views] [int] NOT NULL,
	[likes] [int] NOT NULL,
	[downloads] [int] NOT NULL,
	[isBookmarked] [bit] NOT NULL,
	[isActive] [bit] NOT NULL,
	[uploadDate] [datetime2](7) NOT NULL,
	[createdAt] [datetime2](7) NOT NULL,
	[updatedAt] [datetime2](7) NOT NULL,
	[uploadedBy] [nvarchar](255) NULL,
	[playCount] [int] NULL,
	[lastPlayedAt] [datetime2](7) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

ALTER TABLE [Iftekhari].[Tracks] ADD  DEFAULT ((0)) FOR [views]
GO

ALTER TABLE [Iftekhari].[Tracks] ADD  DEFAULT ((0)) FOR [likes]
GO

ALTER TABLE [Iftekhari].[Tracks] ADD  DEFAULT ((0)) FOR [downloads]
GO

ALTER TABLE [Iftekhari].[Tracks] ADD  DEFAULT ((0)) FOR [isBookmarked]
GO

ALTER TABLE [Iftekhari].[Tracks] ADD  DEFAULT ((1)) FOR [isActive]
GO

ALTER TABLE [Iftekhari].[Tracks] ADD  DEFAULT (getdate()) FOR [uploadDate]
GO

ALTER TABLE [Iftekhari].[Tracks] ADD  DEFAULT (getdate()) FOR [createdAt]
GO

ALTER TABLE [Iftekhari].[Tracks] ADD  DEFAULT (getdate()) FOR [updatedAt]
GO

ALTER TABLE [Iftekhari].[Tracks] ADD  DEFAULT ((0)) FOR [playCount]
GO

ALTER TABLE [Iftekhari].[Tracks]  WITH CHECK ADD  CONSTRAINT [FK_Tracks_Album] FOREIGN KEY([albumId])
REFERENCES [Iftekhari].[Albums] ([id])
ON DELETE SET NULL
GO

ALTER TABLE [Iftekhari].[Tracks] CHECK CONSTRAINT [FK_Tracks_Album]
GO

ALTER TABLE [Iftekhari].[Tracks]  WITH CHECK ADD  CONSTRAINT [CK_Tracks_Downloads] CHECK  (([downloads]>=(0)))
GO

ALTER TABLE [Iftekhari].[Tracks] CHECK CONSTRAINT [CK_Tracks_Downloads]
GO

ALTER TABLE [Iftekhari].[Tracks]  WITH CHECK ADD  CONSTRAINT [CK_Tracks_Duration] CHECK  (([duration]>(0)))
GO

ALTER TABLE [Iftekhari].[Tracks] CHECK CONSTRAINT [CK_Tracks_Duration]
GO

ALTER TABLE [Iftekhari].[Tracks]  WITH CHECK ADD  CONSTRAINT [CK_Tracks_Likes] CHECK  (([likes]>=(0)))
GO

ALTER TABLE [Iftekhari].[Tracks] CHECK CONSTRAINT [CK_Tracks_Likes]
GO

ALTER TABLE [Iftekhari].[Tracks]  WITH CHECK ADD  CONSTRAINT [CK_Tracks_TrackNumber] CHECK  (([trackNumber]>=(1)))
GO

ALTER TABLE [Iftekhari].[Tracks] CHECK CONSTRAINT [CK_Tracks_TrackNumber]
GO

ALTER TABLE [Iftekhari].[Tracks]  WITH CHECK ADD  CONSTRAINT [CK_Tracks_Views] CHECK  (([views]>=(0)))
GO

ALTER TABLE [Iftekhari].[Tracks] CHECK CONSTRAINT [CK_Tracks_Views]
GO



CREATE TABLE [Iftekhari].[Artists](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[name] [nvarchar](255) NOT NULL,
	[bio] [nvarchar](max) NULL,
	[genre] [nvarchar](100) NULL,
	[country] [nvarchar](100) NULL,
	[website] [nvarchar](500) NULL,
	[profileImageUrl] [nvarchar](500) NULL,
	[socialMedia] [nvarchar](max) NULL,
	[birthDate] [date] NULL,
	[deathDate] [date] NULL,
	[isActive] [bit] NOT NULL,
	[status] [nvarchar](20) NOT NULL,
	[totalAlbums] [int] NOT NULL,
	[totalTracks] [int] NOT NULL,
	[totalViews] [int] NOT NULL,
	[totalLikes] [int] NOT NULL,
	[followers] [int] NOT NULL,
	[createdAt] [datetime2](7) NOT NULL,
	[updatedAt] [datetime2](7) NOT NULL,
	[createdBy] [nvarchar](255) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
 CONSTRAINT [UQ_Artists_Name] UNIQUE NONCLUSTERED 
(
	[name] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

ALTER TABLE [Iftekhari].[Artists] ADD  DEFAULT ((1)) FOR [isActive]
GO

ALTER TABLE [Iftekhari].[Artists] ADD  DEFAULT ('active') FOR [status]
GO

ALTER TABLE [Iftekhari].[Artists] ADD  DEFAULT ((0)) FOR [totalAlbums]
GO

ALTER TABLE [Iftekhari].[Artists] ADD  DEFAULT ((0)) FOR [totalTracks]
GO

ALTER TABLE [Iftekhari].[Artists] ADD  DEFAULT ((0)) FOR [totalViews]
GO

ALTER TABLE [Iftekhari].[Artists] ADD  DEFAULT ((0)) FOR [totalLikes]
GO

ALTER TABLE [Iftekhari].[Artists] ADD  DEFAULT ((0)) FOR [followers]
GO

ALTER TABLE [Iftekhari].[Artists] ADD  DEFAULT (getdate()) FOR [createdAt]
GO

ALTER TABLE [Iftekhari].[Artists] ADD  DEFAULT (getdate()) FOR [updatedAt]
GO

ALTER TABLE [Iftekhari].[Artists]  WITH CHECK ADD  CONSTRAINT [CK_Artists_Followers] CHECK  (([followers]>=(0)))
GO

ALTER TABLE [Iftekhari].[Artists] CHECK CONSTRAINT [CK_Artists_Followers]
GO

ALTER TABLE [Iftekhari].[Artists]  WITH CHECK ADD  CONSTRAINT [CK_Artists_Status] CHECK  (([status]='deceased' OR [status]='inactive' OR [status]='active'))
GO

ALTER TABLE [Iftekhari].[Artists] CHECK CONSTRAINT [CK_Artists_Status]
GO

ALTER TABLE [Iftekhari].[Artists]  WITH CHECK ADD  CONSTRAINT [CK_Artists_TotalAlbums] CHECK  (([totalAlbums]>=(0)))
GO

ALTER TABLE [Iftekhari].[Artists] CHECK CONSTRAINT [CK_Artists_TotalAlbums]
GO

ALTER TABLE [Iftekhari].[Artists]  WITH CHECK ADD  CONSTRAINT [CK_Artists_TotalLikes] CHECK  (([totalLikes]>=(0)))
GO

ALTER TABLE [Iftekhari].[Artists] CHECK CONSTRAINT [CK_Artists_TotalLikes]
GO

ALTER TABLE [Iftekhari].[Artists]  WITH CHECK ADD  CONSTRAINT [CK_Artists_TotalTracks] CHECK  (([totalTracks]>=(0)))
GO

ALTER TABLE [Iftekhari].[Artists] CHECK CONSTRAINT [CK_Artists_TotalTracks]
GO

ALTER TABLE [Iftekhari].[Artists]  WITH CHECK ADD  CONSTRAINT [CK_Artists_TotalViews] CHECK  (([totalViews]>=(0)))
GO

ALTER TABLE [Iftekhari].[Artists] CHECK CONSTRAINT [CK_Artists_TotalViews]
GO

CREATE TABLE [Iftekhari].[Albums](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[title] [nvarchar](255) NOT NULL,
	[artist] [nvarchar](255) NOT NULL,
	[genre] [nvarchar](100) NOT NULL,
	[description] [ntext] NULL,
	[releaseDate] [datetime2](7) NULL,
	[releaseYear] [int] NULL,
	[coverImageUrl] [nvarchar](500) NULL,
	[totalTracks] [int] NOT NULL,
	[totalDuration] [int] NOT NULL,
	[status] [nvarchar](20) NOT NULL,
	[views] [int] NOT NULL,
	[likes] [int] NOT NULL,
	[isActive] [bit] NOT NULL,
	[createdAt] [datetime2](7) NOT NULL,
	[updatedAt] [datetime2](7) NOT NULL,
	[createdBy] [nvarchar](255) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

ALTER TABLE [Iftekhari].[Albums] ADD  DEFAULT ((0)) FOR [totalTracks]
GO

ALTER TABLE [Iftekhari].[Albums] ADD  DEFAULT ((0)) FOR [totalDuration]
GO

ALTER TABLE [Iftekhari].[Albums] ADD  DEFAULT ('draft') FOR [status]
GO

ALTER TABLE [Iftekhari].[Albums] ADD  DEFAULT ((0)) FOR [views]
GO

ALTER TABLE [Iftekhari].[Albums] ADD  DEFAULT ((0)) FOR [likes]
GO

ALTER TABLE [Iftekhari].[Albums] ADD  DEFAULT ((1)) FOR [isActive]
GO

ALTER TABLE [Iftekhari].[Albums] ADD  DEFAULT (getdate()) FOR [createdAt]
GO

ALTER TABLE [Iftekhari].[Albums] ADD  DEFAULT (getdate()) FOR [updatedAt]
GO

ALTER TABLE [Iftekhari].[Albums]  WITH CHECK ADD  CONSTRAINT [CK_Albums_Likes] CHECK  (([likes]>=(0)))
GO

ALTER TABLE [Iftekhari].[Albums] CHECK CONSTRAINT [CK_Albums_Likes]
GO

ALTER TABLE [Iftekhari].[Albums]  WITH CHECK ADD  CONSTRAINT [CK_Albums_ReleaseYear] CHECK  (([releaseYear]>=(1900) AND [releaseYear]<=(2100)))
GO

ALTER TABLE [Iftekhari].[Albums] CHECK CONSTRAINT [CK_Albums_ReleaseYear]
GO

ALTER TABLE [Iftekhari].[Albums]  WITH CHECK ADD  CONSTRAINT [CK_Albums_Status] CHECK  (([status]='published' OR [status]='draft'))
GO

ALTER TABLE [Iftekhari].[Albums] CHECK CONSTRAINT [CK_Albums_Status]
GO

ALTER TABLE [Iftekhari].[Albums]  WITH CHECK ADD  CONSTRAINT [CK_Albums_TotalDuration] CHECK  (([totalDuration]>=(0)))
GO

ALTER TABLE [Iftekhari].[Albums] CHECK CONSTRAINT [CK_Albums_TotalDuration]
GO

ALTER TABLE [Iftekhari].[Albums]  WITH CHECK ADD  CONSTRAINT [CK_Albums_TotalTracks] CHECK  (([totalTracks]>=(0)))
GO

ALTER TABLE [Iftekhari].[Albums] CHECK CONSTRAINT [CK_Albums_TotalTracks]
GO

ALTER TABLE [Iftekhari].[Albums]  WITH CHECK ADD  CONSTRAINT [CK_Albums_Views] CHECK  (([views]>=(0)))
GO

ALTER TABLE [Iftekhari].[Albums] CHECK CONSTRAINT [CK_Albums_Views]
GO


