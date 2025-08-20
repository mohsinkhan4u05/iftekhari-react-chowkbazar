import type { NextApiRequest, NextApiResponse } from "next";
import { getConnection } from "../../../../framework/lib/db";
// @ts-ignore
import sql from "mssql";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    query: { albumId },
    method,
  } = req;

  if (method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const pool = await getConnection();

    // 👇 Ensure correct type (adjust if Albums.id is not INT)
    const parsedAlbumId = parseInt(albumId as string, 10);
    console.log("Fetching album with ID:", parsedAlbumId);

    const result = await pool.request().input("albumId", sql.Int, parsedAlbumId)
      .query(`
        SELECT 
          a.id AS albumId,
          a.title,
          a.artist,
          a.coverImageUrl,
          a.releaseDate,
          a.genre,
          a.createdAt,
          a.updatedAt,
          t.id AS trackId,
          t.title AS trackTitle,
          t.artist AS trackArtist,
          t.albumId,
          t.duration,
          t.audioUrl,
          t.coverImage AS trackCover,
          t.createdAt AS trackCreatedAt,
          t.updatedAt AS trackUpdatedAt
        FROM [Iftekhari].[Albums] a
        LEFT JOIN [Iftekhari].[Tracks] t ON a.id = t.albumId
        WHERE a.id = @albumId
        ORDER BY t.trackNumber
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "Album not found" });
    }

    const firstRow = result.recordset[0];

    const album = {
      id: firstRow.albumId,
      title: firstRow.title,
      artist: firstRow.artist,
      coverImageUrl: firstRow.coverImageUrl,
      releaseDate: firstRow.releaseDate,
      genre: firstRow.genre,
      createdAt: firstRow.createdAt,
      updatedAt: firstRow.updatedAt,
      tracks: result.recordset
        .filter((row) => row.trackId)
        .map((row) => ({
          id: row.trackId,
          title: row.trackTitle,
          artist: row.trackArtist,
          albumId: row.albumId,
          duration: row.duration || 0,
          audioUrl: row.audioUrl,
          coverImage: row.trackCover,
          createdAt: row.trackCreatedAt,
          updatedAt: row.trackUpdatedAt,
        })),
    };

    res.status(200).json(album);
  } catch (error) {
    console.error("Album Info API Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
