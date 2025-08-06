import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import { getConnection } from "../../../../framework/lib/db";

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

    // Get user ID
    const userResult = await pool
      .request()
      .input("email", session.user.email)
      .query("SELECT Id FROM Iftekhari.IftekhariUsers WHERE Email = @email");

    if (userResult.recordset.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const userId = userResult.recordset[0].Id;

    if (req.method === "GET") {
      // Get playlist details with tracks
      const playlistResult = await pool
        .request()
        .input("playlistId", playlistId)
        .input("userId", userId).query(`
          SELECT Id, Name, Description, CoverImage, CreatedAt, UpdatedAt
          FROM Iftekhari.Playlists 
          WHERE Id = @playlistId AND UserId = @userId AND IsDeleted = 0
        `);

      if (playlistResult.recordset.length === 0) {
        return res.status(404).json({ error: "Playlist not found" });
      }

      const playlist = playlistResult.recordset[0];

      // Get tracks in playlist
      const tracksResult = await pool.request().input("playlistId", playlistId)
        .query(`
          SELECT 
            t.id,
            t.title,
            t.artist,
            t.albumId,
            t.duration,
            t.audioUrl,
            t.coverImage,
            pt.AddedAt,
            pt.Position
          FROM Iftekhari.PlaylistTracks pt
          INNER JOIN Iftekhari.Tracks t ON pt.TrackId = t.id
          WHERE pt.PlaylistId = @playlistId
          ORDER BY pt.Position ASC, pt.AddedAt ASC
        `);

      const tracks = tracksResult.recordset.map((track) => ({
        id: track.id.toString(),
        title: track.title,
        artist: track.artist,
        album: track.albumId,
        duration: track.duration,
        url: track.audioUrl,
        audioUrl: track.audioUrl,
        cover: track.coverImage,
        coverImage: track.coverImage,
        addedAt: track.AddedAt,
        position: track.Position,
      }));

      const playlistData = {
        id: playlist.Id.toString(),
        name: playlist.Name,
        description: playlist.Description,
        cover: playlist.CoverImage,
        createdAt: playlist.CreatedAt,
        updatedAt: playlist.UpdatedAt,
        tracks: tracks,
        trackCount: tracks.length,
      };

      return res.status(200).json({ playlist: playlistData });
    } else if (req.method === "PUT") {
      // Update playlist details
      const { name, description, coverImage } = req.body;

      if (!name || name.trim().length === 0) {
        return res.status(400).json({ error: "Playlist name is required" });
      }

      // Verify playlist ownership
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

      // Update playlist
      await pool
        .request()
        .input("playlistId", playlistId)
        .input("name", name.trim())
        .input("description", description?.trim() || "")
        .input("coverImage", coverImage || null)
        .input("updatedAt", new Date()).query(`
          UPDATE Iftekhari.Playlists 
          SET Name = @name, Description = @description, CoverImage = @coverImage, UpdatedAt = @updatedAt
          WHERE Id = @playlistId
        `);

      return res.status(200).json({
        message: "Playlist updated successfully",
        playlist: {
          id: playlistId,
          name: name.trim(),
          description: description?.trim() || "",
          cover: coverImage || null,
          updatedAt: new Date().toISOString(),
        },
      });
    } else if (req.method === "DELETE") {
      // Delete playlist (soft delete)
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

      // Soft delete playlist
      await pool
        .request()
        .input("playlistId", playlistId)
        .input("updatedAt", new Date()).query(`
          UPDATE Iftekhari.Playlists 
          SET IsDeleted = 1, UpdatedAt = @updatedAt
          WHERE Id = @playlistId
        `);

      // Delete playlist tracks
      await pool
        .request()
        .input("playlistId", playlistId)
        .query(
          "DELETE FROM Iftekhari.PlaylistTracks WHERE PlaylistId = @playlistId"
        );

      return res.status(200).json({ message: "Playlist deleted successfully" });
    } else {
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
      return res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    console.error("Playlist API error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
