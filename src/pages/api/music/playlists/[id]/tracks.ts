import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]";
import { getConnection } from "../../../../../framework/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.email) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { id: playlistId } = req.query;
    if (!playlistId || typeof playlistId !== "string") {
      return res.status(400).json({ error: "Invalid playlist ID" });
    }

    const pool = await getConnection();

    // Get user ID and verify playlist ownership
    const userResult = await pool
      .request()
      .input("email", session.user.email)
      .query("SELECT Id FROM Iftekhari.IftekhariUsers WHERE Email = @email");

    if (userResult.recordset.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const userId = userResult.recordset[0].Id;

    // Verify playlist exists and user owns it
    const playlistResult = await pool
      .request()
      .input("playlistId", playlistId)
      .input("userId", userId).query(`
        SELECT Id FROM Iftekhari.Playlists 
        WHERE Id = @playlistId AND UserId = @userId AND IsDeleted = 0
      `);

    if (playlistResult.recordset.length === 0) {
      return res.status(404).json({ error: "Playlist not found" });
    }

    if (req.method === "POST") {
      // Add track to playlist
      const { trackId } = req.body;

      if (!trackId) {
        return res.status(400).json({ error: "Track ID is required" });
      }

      // Verify track exists
      const trackResult = await pool
        .request()
        .input("trackId", trackId)
        .query("SELECT Id FROM Iftekhari.Tracks WHERE Id = @trackId");

      if (trackResult.recordset.length === 0) {
        return res.status(404).json({ error: "Track not found" });
      }

      // Check if track is already in playlist
      const existingResult = await pool
        .request()
        .input("playlistId", playlistId)
        .input("trackId", trackId).query(`
          SELECT Id FROM Iftekhari.PlaylistTracks 
          WHERE PlaylistId = @playlistId AND TrackId = @trackId
        `);

      if (existingResult.recordset.length > 0) {
        return res
          .status(200)
          .json({ 
            message: "Track already exists in playlist",
            alreadyExists: true,
            trackId: trackId 
          });
      }

      // Get next position
      const positionResult = await pool
        .request()
        .input("playlistId", playlistId).query(`
          SELECT ISNULL(MAX(Position), 0) + 1 as NextPosition 
          FROM Iftekhari.PlaylistTracks 
          WHERE PlaylistId = @playlistId
        `);

      const nextPosition = positionResult.recordset[0].NextPosition;

      // Add track to playlist
      await pool
        .request()
        .input("playlistId", playlistId)
        .input("trackId", trackId)
        .input("position", nextPosition)
        .input("addedAt", new Date()).query(`
          INSERT INTO Iftekhari.PlaylistTracks (PlaylistId, TrackId, Position, AddedAt)
          VALUES (@playlistId, @trackId, @position, @addedAt)
        `);

      // Update playlist updated time
      await pool
        .request()
        .input("playlistId", playlistId)
        .input("updatedAt", new Date()).query(`
          UPDATE Iftekhari.Playlists 
          SET UpdatedAt = @updatedAt 
          WHERE Id = @playlistId
        `);

      return res.status(201).json({
        message: "Track added to playlist successfully",
        trackId: trackId,
        position: nextPosition,
      });
    } else if (req.method === "DELETE") {
      // Remove track from playlist
      const { trackId } = req.body;

      if (!trackId) {
        return res.status(400).json({ error: "Track ID is required" });
      }

      // Check if track is in playlist
      const existingResult = await pool
        .request()
        .input("playlistId", playlistId)
        .input("trackId", trackId).query(`
          SELECT Position FROM Iftekhari.PlaylistTracks 
          WHERE PlaylistId = @playlistId AND TrackId = @trackId
        `);

      if (existingResult.recordset.length === 0) {
        return res.status(404).json({ error: "Track not found in playlist" });
      }

      const removedPosition = existingResult.recordset[0].Position;

      // Remove track from playlist
      await pool
        .request()
        .input("playlistId", playlistId)
        .input("trackId", trackId).query(`
          DELETE FROM Iftekhari.PlaylistTracks 
          WHERE PlaylistId = @playlistId AND TrackId = @trackId
        `);

      // Reorder remaining tracks
      await pool
        .request()
        .input("playlistId", playlistId)
        .input("removedPosition", removedPosition).query(`
          UPDATE Iftekhari.PlaylistTracks 
          SET Position = Position - 1 
          WHERE PlaylistId = @playlistId AND Position > @removedPosition
        `);

      // Update playlist updated time
      await pool
        .request()
        .input("playlistId", playlistId)
        .input("updatedAt", new Date()).query(`
          UPDATE Iftekhari.Playlists 
          SET UpdatedAt = @updatedAt 
          WHERE Id = @playlistId
        `);

      return res.status(200).json({
        message: "Track removed from playlist successfully",
        trackId: trackId,
      });
    } else if (req.method === "PUT") {
      // Reorder tracks in playlist
      const { tracks } = req.body;

      if (!Array.isArray(tracks)) {
        return res.status(400).json({ error: "Tracks array is required" });
      }

      // Update positions for all tracks
      for (let i = 0; i < tracks.length; i++) {
        const trackId = tracks[i];
        await pool
          .request()
          .input("playlistId", playlistId)
          .input("trackId", trackId)
          .input("position", i + 1).query(`
            UPDATE Iftekhari.PlaylistTracks 
            SET Position = @position 
            WHERE PlaylistId = @playlistId AND TrackId = @trackId
          `);
      }

      // Update playlist updated time
      await pool
        .request()
        .input("playlistId", playlistId)
        .input("updatedAt", new Date()).query(`
          UPDATE Iftekhari.Playlists 
          SET UpdatedAt = @updatedAt 
          WHERE Id = @playlistId
        `);

      return res.status(200).json({
        message: "Playlist tracks reordered successfully",
      });
    } else {
      res.setHeader("Allow", ["POST", "DELETE", "PUT"]);
      return res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    console.error("Playlist tracks API error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
