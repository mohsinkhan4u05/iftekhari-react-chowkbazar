import type { NextApiRequest, NextApiResponse } from "next";
import { getConnection } from "../../../framework/lib/db";
// @ts-ignore
import sql from "mssql";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { search = "", limit = 50 } = req.query;
    const pool = await getConnection();
    const request = pool.request();

    // Build WHERE clause
    let whereClause = "WHERE a.isActive = 1";

    if (search) {
      whereClause +=
        " AND (a.title LIKE @search OR a.artist LIKE @search OR a.genre LIKE @search)";
      request.input("search", sql.VarChar, `%${search}%`);
    }

    // Add limit
    request.input("limit", sql.Int, Number(limit));

    const result = await request.query(`
      SELECT TOP (@limit)
        a.id AS albumId,
        a.title AS albumTitle,
        a.artist AS albumArtist,
        a.coverImageUrl AS albumCover,
        a.releaseDate,
        a.genre AS albumGenre,
        a.createdAt AS albumCreatedAt,
        a.updatedAt AS albumUpdatedAt,
        (
          SELECT 
            t.id AS id,
            t.title AS title,
            t.artist AS artist,
            t.albumId,
            t.genre,
            t.duration,
            t.audioUrl,
            t.coverImage AS coverImage,
            t.createdAt,
            t.updatedAt,
            t.trackNumber
          FROM [Iftekhari].[Tracks] t
          WHERE t.albumId = a.id AND t.isActive = 1
          ORDER BY t.trackNumber
          FOR JSON PATH
        ) AS tracks
      FROM [Iftekhari].[Albums] a
      ${whereClause}
      ORDER BY a.id
    `);

    // Parse tracks JSON string into JS array
    const albums = result.recordset.map((row: any) => ({
      id: row.albumId,
      title: row.albumTitle,
      artist: row.albumArtist,
      coverImageUrl: row.albumCover,
      releaseDate: row.releaseDate,
      genre: row.albumGenre,
      createdAt: row.albumCreatedAt,
      updatedAt: row.albumUpdatedAt,
      tracks: row.tracks ? JSON.parse(row.tracks) : [],
    }));

    res.status(200).json(albums);
  } catch (error) {
    console.error("Albums API Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
