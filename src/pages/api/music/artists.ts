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
    let whereClause = "WHERE ar.isActive = 1";

    if (search) {
      whereClause +=
        " AND (ar.name LIKE @search OR ar.bio LIKE @search OR ar.genre LIKE @search)";
      request.input("search", sql.VarChar, `%${search}%`);
    }

    // Add limit
    request.input("limit", sql.Int, Number(limit));

    const result = await request.query(`
      SELECT TOP (@limit)
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
      ${whereClause}
      ORDER BY ar.id, al.id
    `);

    const artistMap = new Map();

    result.recordset.forEach((row: any) => {
      if (!artistMap.has(row.artistId)) {
        artistMap.set(row.artistId, {
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
        });
      }

      if (row.albumId) {
        artistMap.get(row.artistId).albums.push({
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
        });
      }
    });

    const artists = Array.from(artistMap.values());
    res.status(200).json(artists);
  } catch (error) {
    console.error("Artists API Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
