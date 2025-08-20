import type { NextApiRequest, NextApiResponse } from "next";
import { getConnection } from "../../../../framework/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
// @ts-ignore
import sql from "mssql";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session?.user?.email) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const userId = session.user.email;

  switch (req.method) {
    case "GET":
      return handleGetPlaylists(req, res, userId);
    case "POST":
      return handleCreatePlaylist(req, res, userId);
    default:
      return res.status(405).json({ message: "Method Not Allowed" });
  }
}

async function handleGetPlaylists(
  req: NextApiRequest,
  res: NextApiResponse,
  userId: string
) {
  try {
    const pool = await getConnection();
    const request = pool.request();

    const result = await request.input("userId", sql.VarChar, userId).query(`
        SELECT 
          p.id,
          p.name,
          p.description,
          p.coverImageUrl,
          p.isPublic,
          p.totalTracks,
          p.totalDuration,
          p.createdAt,
          p.updatedAt,
          (
            SELECT TOP 1 t.coverImage
            FROM [Iftekhari].[PlaylistTracksNew] pt
            INNER JOIN [Iftekhari].[Tracks] t ON pt.trackId = t.id
            WHERE pt.playlistId = p.id AND t.isActive = 1
            ORDER BY pt.position
          ) AS firstTrackCover
        FROM [Iftekhari].[PlaylistsNew] p
        WHERE p.userId = @userId AND p.isActive = 1
        ORDER BY p.updatedAt DESC
      `);

    const playlists = result.recordset.map((row: any) => ({
      id: row.id,
      name: row.name,
      description: row.description,
      coverImageUrl: row.coverImageUrl || row.firstTrackCover,
      isPublic: row.isPublic,
      totalTracks: row.totalTracks,
      totalDuration: row.totalDuration,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    }));

    res.status(200).json(playlists);
  } catch (error) {
    console.error("Get Playlists API Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function handleCreatePlaylist(
  req: NextApiRequest,
  res: NextApiResponse,
  userId: string
) {
  try {
    const { name, description, coverImageUrl, isPublic = true } = req.body;

    if (!name || name.trim().length === 0) {
      return res.status(400).json({ message: "Playlist name is required" });
    }

    const pool = await getConnection();
    const request = pool.request();

    const result = await request
      .input("name", sql.NVarChar, name.trim())
      .input("description", sql.NVarChar, description || null)
      .input("coverImageUrl", sql.NVarChar, coverImageUrl || null)
      .input("isPublic", sql.Bit, isPublic)
      .input("userId", sql.VarChar, userId).query(`
        INSERT INTO [Iftekhari].[PlaylistsNew] (name, description, coverImageUrl, isPublic, userId)
        OUTPUT INSERTED.id, INSERTED.name, INSERTED.description, INSERTED.coverImageUrl, 
               INSERTED.isPublic, INSERTED.totalTracks, INSERTED.totalDuration, 
               INSERTED.createdAt, INSERTED.updatedAt
        VALUES (@name, @description, @coverImageUrl, @isPublic, @userId)
      `);

    const newPlaylist = result.recordset[0];

    res.status(201).json({
      id: newPlaylist.id,
      name: newPlaylist.name,
      description: newPlaylist.description,
      coverImageUrl: newPlaylist.coverImageUrl,
      isPublic: newPlaylist.isPublic,
      totalTracks: newPlaylist.totalTracks,
      totalDuration: newPlaylist.totalDuration,
      createdAt: newPlaylist.createdAt,
      updatedAt: newPlaylist.updatedAt,
    });
  } catch (error) {
    console.error("Create Playlist API Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
