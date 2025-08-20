import type { NextApiRequest, NextApiResponse } from "next";
import { getConnection } from "../../../../../framework/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]";
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
  const { id: playlistId } = req.query;

  if (!playlistId || typeof playlistId !== "string") {
    return res.status(400).json({ message: "Playlist ID is required" });
  }

  switch (req.method) {
    case "POST":
      return handleAddTrack(req, res, userId, playlistId);
    case "DELETE":
      return handleRemoveTrack(req, res, userId, playlistId);
    default:
      return res.status(405).json({ message: "Method Not Allowed" });
  }
}

async function handleAddTrack(
  req: NextApiRequest,
  res: NextApiResponse,
  userId: string,
  playlistId: string
) {
  try {
    const { trackId } = req.body;

    if (!trackId) {
      return res.status(400).json({ message: "Track ID is required" });
    }

    const pool = await getConnection();

    // Check if playlist exists and belongs to user
    const playlistCheck = await pool
      .request()
      .input("playlistId", sql.Int, playlistId)
      .input("userId", sql.VarChar, userId).query(`
        SELECT id FROM [Iftekhari].[PlaylistsNew]
        WHERE id = @playlistId AND userId = @userId AND isActive = 1
      `);

    if (playlistCheck.recordset.length === 0) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    // Check if track exists
    const trackCheck = await pool.request().input("trackId", sql.Int, trackId)
      .query(`
        SELECT id FROM [Iftekhari].[Tracks]
        WHERE id = @trackId AND isActive = 1
      `);

    if (trackCheck.recordset.length === 0) {
      return res.status(404).json({ message: "Track not found" });
    }

    // Check if track is already in playlist
    const existingTrack = await pool
      .request()
      .input("playlistId", sql.Int, playlistId)
      .input("trackId", sql.Int, trackId).query(`
        SELECT id FROM [Iftekhari].[PlaylistTracksNew]
        WHERE playlistId = @playlistId AND trackId = @trackId
      `);

    if (existingTrack.recordset.length > 0) {
      return res.status(409).json({
        message: "Track already exists in playlist",
        alreadyExists: true,
      });
    }

    // Get the next position for the track
    const positionResult = await pool
      .request()
      .input("playlistId", sql.Int, playlistId).query(`
        SELECT COALESCE(MAX(position), 0) + 1 as nextPosition
        FROM [Iftekhari].[PlaylistTracksNew]
        WHERE playlistId = @playlistId
      `);

    const nextPosition = positionResult.recordset[0].nextPosition;

    // Add track to playlist
    await pool
      .request()
      .input("playlistId", sql.Int, playlistId)
      .input("trackId", sql.Int, trackId)
      .input("addedBy", sql.VarChar, userId)
      .input("position", sql.Int, nextPosition).query(`
        INSERT INTO [Iftekhari].[PlaylistTracksNew] (playlistId, trackId, addedBy, position)
        VALUES (@playlistId, @trackId, @addedBy, @position)
      `);

    res.status(200).json({
      message: "Track added to playlist successfully",
      success: true,
      alreadyExists: false,
    });
  } catch (error) {
    console.error("Add Track to Playlist API Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function handleRemoveTrack(
  req: NextApiRequest,
  res: NextApiResponse,
  userId: string,
  playlistId: string
) {
  try {
    const { trackId } = req.body;

    if (!trackId) {
      return res.status(400).json({ message: "Track ID is required" });
    }

    const pool = await getConnection();

    // Check if playlist exists and belongs to user
    const playlistCheck = await pool
      .request()
      .input("playlistId", sql.Int, playlistId)
      .input("userId", sql.VarChar, userId).query(`
        SELECT id FROM [Iftekhari].[PlaylistsNew]
        WHERE id = @playlistId AND userId = @userId AND isActive = 1
      `);

    if (playlistCheck.recordset.length === 0) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    // Remove track from playlist
    const result = await pool
      .request()
      .input("playlistId", sql.Int, playlistId)
      .input("trackId", sql.Int, trackId).query(`
        DELETE FROM [Iftekhari].[PlaylistTracksNew]
        WHERE playlistId = @playlistId AND trackId = @trackId
      `);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: "Track not found in playlist" });
    }

    res
      .status(200)
      .json({ message: "Track removed from playlist successfully" });
  } catch (error) {
    console.error("Remove Track from Playlist API Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
