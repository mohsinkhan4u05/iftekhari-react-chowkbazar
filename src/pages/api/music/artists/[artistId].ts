import type { NextApiRequest, NextApiResponse } from "next";
import { getConnection } from "../../../../framework/lib/db";
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
    let { artistId } = req.query;
    if (!artistId) {
      return res.status(400).json({ message: "Missing artistId" });
    }
    if (Array.isArray(artistId)) {
      artistId = artistId[0];
    }

    const pool = await getConnection();
    const request = pool.request();
    request.input("artistId", sql.VarChar, artistId);

    const result = await request.query(`
      SELECT
        ar.id AS artistId,
        ar.name,
        ar.bio,
        ar.genre AS artistGenre,
        ar.country,
        ar.website,
        ar.profileImageUrl,
        ar.socialMedia,
        ar.birthDate,
        ar.deathDate,
        ar.isActive AS artistIsActive,
        ar.status AS artistStatus,
        ar.totalAlbums,
        ar.totalTracks,
        ar.totalViews,
        ar.totalLikes,
        ar.followers,
        ar.createdAt AS artistCreatedAt,
        ar.updatedAt AS artistUpdatedAt,

        al.id AS albumId,
        al.title AS albumTitle,
        al.genre AS albumGenre,
        al.description AS albumDescription,
        al.releaseDate,
        al.releaseYear,
        al.coverImageUrl,
        al.totalTracks AS albumTotalTracks,
        al.totalDuration,
        al.status AS albumStatus,
        al.views AS albumViews,
        al.likes AS albumLikes,
        al.isActive AS albumIsActive,
        al.createdAt AS albumCreatedAt,
        al.updatedAt AS albumUpdatedAt
      FROM [Iftekhari].[Artists] ar
      LEFT JOIN [Iftekhari].[Albums] al ON ar.name = al.artist
      WHERE ar.id = @artistId AND ar.isActive = 1
      ORDER BY al.id
    `);

    if (!result.recordset.length) {
      return res.status(404).json({ message: "Artist not found" });
    }

    const row = result.recordset[0];
    const artist: any = {
      id: row.artistId,
      name: row.name,
      bio: row.bio,
      genre: row.artistGenre,
      country: row.country,
      website: row.website,
      profileImageUrl: row.profileImageUrl,
      socialMedia: row.socialMedia,
      birthDate: row.birthDate,
      deathDate: row.deathDate,
      isActive: row.artistIsActive,
      status: row.artistStatus,
      totalAlbums: row.totalAlbums,
      totalTracks: row.totalTracks,
      totalViews: row.totalViews,
      totalLikes: row.totalLikes,
      followers: row.followers,
      createdAt: row.artistCreatedAt,
      updatedAt: row.artistUpdatedAt,
      albums: [],
      tracks: [], // 👈 NEW ARRAY
    };

    // Build albums array
    const albumMap = new Map();
    result.recordset.forEach((row: any) => {
      if (row.albumId && !albumMap.has(row.albumId)) {
        albumMap.set(row.albumId, {
          id: row.albumId,
          title: row.albumTitle,
          genre: row.albumGenre,
          description: row.albumDescription,
          releaseDate: row.releaseDate,
          releaseYear: row.releaseYear,
          coverImageUrl: row.coverImageUrl,
          totalTracks: row.albumTotalTracks,
          totalDuration: row.totalDuration,
          status: row.albumStatus,
          views: row.albumViews,
          likes: row.albumLikes,
          isActive: row.albumIsActive,
          createdAt: row.albumCreatedAt,
          updatedAt: row.albumUpdatedAt,
          tracks: [],
        });
      }
    });

    // For each album, fetch tracks
    const pool2 = await getConnection();
    for (const entry of Array.from(albumMap.entries())) {
      const [albumId, album] = entry;
      const albumIdStr = String(albumId);

      const tracksResult = await pool2
        .request()
        .input("albumId", sql.VarChar, albumIdStr).query(`
          SELECT
            id AS trackId,
            title AS trackTitle,
            artist AS trackArtist,
            albumId,
            duration,
            audioUrl,
            coverImage AS trackCover,
            createdAt AS trackCreatedAt,
            updatedAt AS trackUpdatedAt
          FROM [Iftekhari].[Tracks]
          WHERE albumId = @albumId
          ORDER BY trackNumber
        `);

      album.tracks = tracksResult.recordset.map((track: any) => ({
        id: track.trackId,
        title: track.trackTitle,
        artist: track.trackArtist,
        albumId: track.albumId,
        duration: track.duration || 0,
        audioUrl: track.audioUrl,
        coverImage: track.trackCover,
        createdAt: track.trackCreatedAt,
        updatedAt: track.trackUpdatedAt,
      }));
    }

    // 🔥 Fetch all tracks belonging to the artist (not just album-based)
    const artistTracksResult = await pool2
      .request()
      .input("artistId", sql.VarChar, artistId).query(`
        SELECT
          id AS trackId,
          title AS trackTitle,
          artist AS trackArtist,
          albumId,
          duration,
          audioUrl,
          coverImage AS trackCover,
          createdAt AS trackCreatedAt,
          updatedAt AS trackUpdatedAt
        FROM [Iftekhari].[Tracks]
        WHERE artist = (SELECT name FROM [Iftekhari].[Artists] WHERE id = @artistId)
        ORDER BY createdAt DESC
      `);

    artist.tracks = artistTracksResult.recordset.map((track: any) => ({
      id: track.trackId,
      title: track.trackTitle,
      artist: track.trackArtist,
      albumId: track.albumId,
      duration: track.duration || 0,
      audioUrl: track.audioUrl,
      coverImage: track.trackCover,
      createdAt: track.trackCreatedAt,
      updatedAt: track.trackUpdatedAt,
    }));

    artist.albums = Array.from(albumMap.values());

    res.status(200).json(artist);
  } catch (error) {
    console.error("Artist API Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
