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
  const { id } = req.query;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ message: "Playlist ID is required" });
  }

  switch (req.method) {
    case "GET":
      return handleGetPlaylist(req, res, userId, id);
    case "PUT":
      return handleUpdatePlaylist(req, res, userId, id);
    case "DELETE":
      return handleDeletePlaylist(req, res, userId, id);
    default:
      return res.status(405).json({ message: "Method Not Allowed" });
  }
}

async function handleGetPlaylist(
  req: NextApiRequest,
  res: NextApiResponse,
  userId: string,
  playlistId: string
) {
  try {
    const pool = await getConnection();

    // Get playlist details
    const playlistResult = await pool
      .request()
      .input("playlistId", sql.Int, playlistId)
      .input("userId", sql.VarChar, userId).query(`
        SELECT 
          p.id,
          p.name,
          p.description,
          p.coverImageUrl,
          p.isPublic,
          p.totalTracks,
          p.totalDuration,
          p.createdAt,
          p.updatedAt
        FROM [Iftekhari].[PlaylistsNew] p
        WHERE p.id = @playlistId AND p.userId = @userId AND p.isActive = 1
      `);

    if (playlistResult.recordset.length === 0) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    const playlist = playlistResult.recordset[0];

    // Get tracks in the playlist
    const tracksResult = await pool
      .request()
      .input("playlistId", sql.Int, playlistId).query(`
        SELECT 
          t.id,
          t.title,
          t.artist,
          t.albumId,
          t.genre,
          t.duration,
          t.audioUrl,
          t.coverImage,
          t.createdAt,
          pt.addedAt,
          pt.position
        FROM [Iftekhari].[PlaylistTracksNew] pt
        INNER JOIN [Iftekhari].[Tracks] t ON pt.trackId = t.id
        WHERE pt.playlistId = @playlistId AND t.isActive = 1
        ORDER BY pt.position, pt.addedAt
      `);

    const tracks = tracksResult.recordset.map((track: any) => ({
      id: track.id?.toString(),
      title: track.title || "Unknown Title",
      artist: track.artist || "Unknown Artist",
      albumId: track.albumId?.toString(),
      genre: track.genre || "",
      duration: track.duration || 0,
      audioUrl: track.audioUrl || "",
      coverImage: track.coverImage || "",
      addedAt: track.addedAt,
      position: track.position,
    }));

    res.status(200).json({
      id: playlist.id,
      name: playlist.name,
      description: playlist.description,
      coverImageUrl: playlist.coverImageUrl,
      isPublic: playlist.isPublic,
      totalTracks: playlist.totalTracks,
      totalDuration: playlist.totalDuration,
      createdAt: playlist.createdAt,
      updatedAt: playlist.updatedAt,
      tracks,
    });
  } catch (error) {
    console.error("Get Playlist API Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function handleUpdatePlaylist(
  req: NextApiRequest,
  res: NextApiResponse,
  userId: string,
  playlistId: string
) {
  try {
    const { name, description, coverImageUrl, isPublic } = req.body;

    if (!name || name.trim().length === 0) {
      return res.status(400).json({ message: "Playlist name is required" });
    }

    const pool = await getConnection();

    // Check if playlist exists and belongs to user
    const checkResult = await pool
      .request()
      .input("playlistId", sql.Int, playlistId)
      .input("userId", sql.VarChar, userId).query(`
        SELECT id FROM [Iftekhari].[PlaylistsNew]
        WHERE id = @playlistId AND userId = @userId AND isActive = 1
      `);

    if (checkResult.recordset.length === 0) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    // Update playlist
    const result = await pool
      .request()
      .input("playlistId", sql.Int, playlistId)
      .input("name", sql.NVarChar, name.trim())
      .input("description", sql.NVarChar, description || null)
      .input("coverImageUrl", sql.NVarChar, coverImageUrl || null)
      .input("isPublic", sql.Bit, isPublic).query(`
        UPDATE [Iftekhari].[PlaylistsNew]
        SET 
          name = @name,
          description = @description,
          coverImageUrl = @coverImageUrl,
          isPublic = @isPublic,
          updatedAt = GETDATE()
        OUTPUT INSERTED.id, INSERTED.name, INSERTED.description, INSERTED.coverImageUrl,
               INSERTED.isPublic, INSERTED.totalTracks, INSERTED.totalDuration,
               INSERTED.createdAt, INSERTED.updatedAt
        WHERE id = @playlistId
      `);

    const updatedPlaylist = result.recordset[0];

    res.status(200).json({
      id: updatedPlaylist.id,
      name: updatedPlaylist.name,
      description: updatedPlaylist.description,
      coverImageUrl: updatedPlaylist.coverImageUrl,
      isPublic: updatedPlaylist.isPublic,
      totalTracks: updatedPlaylist.totalTracks,
      totalDuration: updatedPlaylist.totalDuration,
      createdAt: updatedPlaylist.createdAt,
      updatedAt: updatedPlaylist.updatedAt,
    });
  } catch (error) {
    console.error("Update Playlist API Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function handleDeletePlaylist(
  req: NextApiRequest,
  res: NextApiResponse,
  userId: string,
  playlistId: string
) {
  try {
    const pool = await getConnection();

    // Check if playlist exists and belongs to user
    const checkResult = await pool
      .request()
      .input("playlistId", sql.Int, playlistId)
      .input("userId", sql.VarChar, userId).query(`
        SELECT id FROM [Iftekhari].[PlaylistsNew]
        WHERE id = @playlistId AND userId = @userId AND isActive = 1
      `);

    if (checkResult.recordset.length === 0) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    // Soft delete playlist
    await pool.request().input("playlistId", sql.Int, playlistId).query(`
        UPDATE [Iftekhari].[PlaylistsNew]
        SET isActive = 0, updatedAt = GETDATE()
        WHERE id = @playlistId
      `);

    res.status(200).json({ message: "Playlist deleted successfully" });
  } catch (error) {
    console.error("Delete Playlist API Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
