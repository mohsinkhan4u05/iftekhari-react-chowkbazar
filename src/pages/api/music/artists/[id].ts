import type { NextApiRequest, NextApiResponse } from "next";
import { getConnection } from "../../../../framework/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    query: { id },
    method,
  } = req;

  if (method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const pool = await getConnection();

    const result = await pool.request().input("ArtistId", id).query(`
      SELECT 
        ar.id AS artistId,
        ar.name AS artistName,
        ar.profileImageUrl AS artistImage,
        ar.bio AS artistBio,
        ar.createdAt AS artistCreatedAt,
        ar.updatedAt AS artistUpdatedAt,

        al.id AS albumId,
        al.title AS albumTitle,
        al.artist AS albumArtist,
        al.coverImageUrl AS albumCover,
        al.releaseDate AS albumReleaseDate,
        al.genre AS albumGenre,

        t.id AS trackId,
        t.title AS trackTitle,
        t.artist AS trackArtist,
        t.albumId AS trackAlbumId,
        t.duration AS trackDuration,
        t.audioUrl AS trackUrl,
        t.coverImage AS trackCover
      FROM [Iftekhari].[Artists] ar
      LEFT JOIN [Iftekhari].[Albums] al ON ar.name = al.artist
      LEFT JOIN [Iftekhari].[Tracks] t ON al.id = t.albumId
      WHERE ar.id = @ArtistId
      ORDER BY al.id, t.trackNumber
    `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "Artist not found" });
    }

    const firstRow = result.recordset[0];

    const albumMap = new Map();

    result.recordset.forEach((row) => {
      if (row.albumId && !albumMap.has(row.albumId)) {
        albumMap.set(row.albumId, {
          id: row.albumId,
          title: row.albumTitle,
          artist: row.albumArtist,
          coverImageUrl: row.albumCover,
          releaseDate: row.albumReleaseDate,
          genre: row.albumGenre,
          tracks: [],
        });
      }

      if (row.trackId && row.albumId) {
        albumMap.get(row.albumId).tracks.push({
          id: row.trackId,
          title: row.trackTitle,
          artist: row.trackArtist,
          albumId: row.trackAlbumId,
          duration: row.trackDuration || 0,
          audioUrl: row.trackUrl,
          coverImage: row.trackCover,
        });
      }
    });

    const artist = {
      id: firstRow.artistId,
      name: firstRow.artistName,
      image: firstRow.artistImage,
      bio: firstRow.artistBio,
      createdAt: firstRow.artistCreatedAt,
      updatedAt: firstRow.artistUpdatedAt,
      albums: Array.from(albumMap.values()),
    };

    res.status(200).json(artist);
  } catch (error) {
    console.error("Artist Info API Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
