import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import { getConnection } from "../../../../framework/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Get user session
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.email) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const pool = await getConnection();

    if (req.method === "GET") {
      // Get user's playlists
      const userResult = await pool
        .request()
        .input("email", session.user.email)
        .query("SELECT Id FROM Iftekhari.IftekhariUsers WHERE Email = @email");

      if (userResult.recordset.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      const userId = userResult.recordset[0].Id;

      // Get playlists with track count
      const playlistsResult = await pool.request().input("userId", userId)
        .query(`
          SELECT 
            p.Id,
            p.Name,
            p.Description,
            p.CoverImage,
            p.CreatedAt,
            p.UpdatedAt,
            COUNT(pt.TrackId) as TrackCount
          FROM Iftekhari.Playlists p
          LEFT JOIN Iftekhari.PlaylistTracks pt ON p.Id = pt.PlaylistId
          WHERE p.UserId = @userId AND p.IsDeleted = 0
          GROUP BY p.Id, p.Name, p.Description, p.CoverImage, p.CreatedAt, p.UpdatedAt
          ORDER BY p.UpdatedAt DESC
        `);

      const playlists = playlistsResult.recordset.map((playlist) => ({
        id: playlist.Id.toString(),
        name: playlist.Name,
        description: playlist.Description,
        cover: playlist.CoverImage,
        createdAt: playlist.CreatedAt,
        updatedAt: playlist.UpdatedAt,
        trackCount: playlist.TrackCount,
      }));

      return res.status(200).json({ playlists });
    } else if (req.method === "POST") {
      // Create new playlist
      const { name, description, coverImage } = req.body;

      if (!name || name.trim().length === 0) {
        return res.status(400).json({ error: "Playlist name is required" });
      }

      const userResult = await pool
        .request()
        .input("email", session.user.email)
        .query("SELECT Id FROM Iftekhari.IftekhariUsers WHERE Email = @email");

      if (userResult.recordset.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      const userId = userResult.recordset[0].Id;

      // Create playlist
      const result = await pool
        .request()
        .input("userId", userId)
        .input("name", name.trim())
        .input("description", description?.trim() || "")
        .input("coverImage", coverImage || null)
        .input("createdAt", new Date())
        .input("updatedAt", new Date()).query(`
          INSERT INTO Iftekhari.Playlists (UserId, Name, Description, CoverImage, CreatedAt, UpdatedAt, IsDeleted)
          OUTPUT INSERTED.Id
          VALUES (@userId, @name, @description, @coverImage, @createdAt, @updatedAt, 0)
        `);

      const playlistId = result.recordset[0].Id;

      const newPlaylist = {
        id: playlistId.toString(),
        name: name.trim(),
        description: description?.trim() || "",
        cover: coverImage || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        trackCount: 0,
      };

      return res.status(201).json({ playlist: newPlaylist });
    } else {
      res.setHeader("Allow", ["GET", "POST"]);
      return res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    console.error("Playlists API error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
