import type { NextApiRequest, NextApiResponse } from "next";
import { getConnection } from "../../../framework/lib/db";
import sql from "mssql";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  if (method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const {
      limit = 10,
      timeframe = '30', // days
      type = 'trending' // trending, popular, mostPlayed
    } = req.query;

    const pool = await getConnection();
    const request = pool.request();

    // Set parameters
    request.input('limit', sql.Int, Number(limit));
    request.input('timeframeDays', sql.Int, Number(timeframe));

    let query = '';
    
    switch (type) {
      case 'trending':
        // Trending songs based on recent plays, likes, and views with weighted scoring
        query = `
          SELECT TOP (@limit)
            t.id,
            t.title,
            t.artist,
            t.albumId,
            t.genre,
            t.duration,
            t.durationFormatted,
            t.audioUrl,
            t.coverImage,
            t.views,
            t.likes,
            t.downloads,
            t.playCount,
            t.lastPlayedAt,
            t.createdAt,
            t.updatedAt,
            -- Calculate trending score based on recent activity
            (
              -- Recent plays weight (40%)
              COALESCE(t.playCount * 0.4, 0) +
              -- Recent likes weight (30%)
              COALESCE(t.likes * 0.3, 0) +
              -- Recent views weight (20%)
              COALESCE(t.views * 0.2, 0) +
              -- Recency bonus (10%) - newer tracks get slight boost
              CASE 
                WHEN DATEDIFF(day, t.createdAt, GETDATE()) <= 7 THEN 10
                WHEN DATEDIFF(day, t.createdAt, GETDATE()) <= 30 THEN 5
                ELSE 0
              END * 0.1
            ) as trendingScore
          FROM [Iftekhari].[Tracks] t
          WHERE t.isActive = 1
            AND (
              t.lastPlayedAt >= DATEADD(day, -@timeframeDays, GETDATE()) OR
              t.createdAt >= DATEADD(day, -@timeframeDays, GETDATE()) OR
              t.updatedAt >= DATEADD(day, -@timeframeDays, GETDATE())
            )
          ORDER BY trendingScore DESC, t.playCount DESC, t.views DESC
        `;
        break;

      case 'popular':
        // Most popular songs overall
        query = `
          SELECT TOP (@limit)
            t.id,
            t.title,
            t.artist,
            t.albumId,
            t.genre,
            t.duration,
            t.durationFormatted,
            t.audioUrl,
            t.coverImage,
            t.views,
            t.likes,
            t.downloads,
            t.playCount,
            t.lastPlayedAt,
            t.createdAt,
            t.updatedAt,
            (t.playCount + t.likes + (t.views * 0.1)) as popularityScore
          FROM [Iftekhari].[Tracks] t
          WHERE t.isActive = 1
          ORDER BY popularityScore DESC, t.createdAt DESC
        `;
        break;

      case 'mostPlayed':
        // Most played songs
        query = `
          SELECT TOP (@limit)
            t.id,
            t.title,
            t.artist,
            t.albumId,
            t.genre,
            t.duration,
            t.durationFormatted,
            t.audioUrl,
            t.coverImage,
            t.views,
            t.likes,
            t.downloads,
            t.playCount,
            t.lastPlayedAt,
            t.createdAt,
            t.updatedAt
          FROM [Iftekhari].[Tracks] t
          WHERE t.isActive = 1
            AND t.playCount > 0
          ORDER BY t.playCount DESC, t.views DESC, t.likes DESC
        `;
        break;

      default:
        // Default to trending
        query = `
          SELECT TOP (@limit)
            t.id,
            t.title,
            t.artist,
            t.albumId,
            t.genre,
            t.duration,
            t.durationFormatted,
            t.audioUrl,
            t.coverImage,
            t.views,
            t.likes,
            t.downloads,
            t.playCount,
            t.lastPlayedAt,
            t.createdAt,
            t.updatedAt
          FROM [Iftekhari].[Tracks] t
          WHERE t.isActive = 1
          ORDER BY t.createdAt DESC
        `;
    }

    const result = await request.query(query);
    
    const tracks = result.recordset.map((track) => ({
      id: track.id,
      title: track.title || 'Unknown Title',
      artist: track.artist || 'Unknown Artist',
      album: track.albumId || '',
      albumId: track.albumId,
      genre: track.genre || '',
      duration: track.durationFormatted || track.duration || '0:00',
      audioUrl: track.audioUrl || '',
      cover: track.coverImage || '',
      coverImage: track.coverImage || '',
      views: track.views || 0,
      likes: track.likes || 0,
      plays: track.playCount || 0,
      downloads: track.downloads || 0,
      lastPlayedAt: track.lastPlayedAt,
      createdAt: track.createdAt,
      updatedAt: track.updatedAt,
      // Add trending score if available
      ...(track.trendingScore && { trendingScore: track.trendingScore }),
      ...(track.popularityScore && { popularityScore: track.popularityScore })
    }));

    res.status(200).json({
      success: true,
      data: tracks,
      meta: {
        type: type as string,
        timeframe: Number(timeframe),
        limit: Number(limit),
        count: tracks.length,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error("Trending Kalam API Error:", error);
    res.status(500).json({ 
      success: false,
      message: "Internal Server Error",
      error: process.env.NODE_ENV === 'development' ? error.message : 'Database error'
    });
  }
}
