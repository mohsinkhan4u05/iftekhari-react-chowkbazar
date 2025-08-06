import { NextApiRequest, NextApiResponse } from "next";
import { getConnection } from "../../../framework/lib/db";
import sql from "mssql";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    query: { id },
    method,
  } = req;

  try {
    const pool = await getConnection();

    switch (method) {
      case "GET":
        try {
          const request = pool.request();
          request.input("AlbumId", sql.Int, id);
          const result = await request.query(`
            SELECT 
              id,
              title,
              artist,
              genre,
              description,
              releaseDate,
              releaseYear,
              coverImageUrl,
              totalTracks,
              createdAt,
              updatedAt,
              isActive
            FROM [Iftekhari].[Albums]
            WHERE id = @AlbumId AND isActive = 1
          `);

          if (result.recordset.length === 0) {
            return res.status(404).json({ message: "Album not found" });
          }

          const album = result.recordset[0];
          const responseAlbum = {
            id: album.id?.toString(),
            title: album.title || "",
            artist: album.artist || "",
            genre: album.genre || "",
            description: album.description || "",
            releaseDate: album.releaseDate || "",
            releaseYear: album.releaseYear || "",
            coverImageUrl: album.coverImageUrl || "",
            totalTracks: album.totalTracks || 0,
            createdAt: album.createdAt || new Date().toISOString(),
          };

          res.status(200).json(responseAlbum);
        } catch (error) {
          console.error("Error fetching album:", error);
          res.status(500).json({ message: "Failed to fetch album" });
        }
        break;

      case "PUT":
        try {
          const { title, artist, description } = req.body;

          if (!title) {
            return res.status(400).json({ message: "Title is required" });
          }

          if (!artist) {
            return res.status(400).json({ message: "Artist is required" });
          }

          const request = pool.request();
          request.input("AlbumId", sql.Int, id);
          request.input("title", sql.NVarChar, title);
          request.input("artist", sql.NVarChar, artist);
          request.input("description", sql.NVarChar, description || "");
          request.input("updatedAt", sql.DateTime2, new Date());

          const result = await request.query(`
            UPDATE [Iftekhari].[Albums] 
            SET title = @title, 
                artist = @artist, 
                description = @description, 
                updatedAt = @updatedAt
            WHERE id = @AlbumId
          `);

          if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: "Album not found" });
          }

          // Fetch updated album
          const getRequest = pool.request();
          getRequest.input("AlbumId", sql.Int, id);
          const getResult = await getRequest.query(`
            SELECT 
              id,
              title,
              artist,
              genre,
              description,
              releaseDate,
              releaseYear,
              coverImageUrl,
              totalTracks,
              createdAt,
              updatedAt
            FROM [Iftekhari].[Albums]
            WHERE id = @AlbumId
          `);

          if (getResult.recordset.length === 0) {
            return res.status(404).json({ message: "Album not found" });
          }

          const updatedAlbum = getResult.recordset[0];
          const responseAlbum = {
            id: updatedAlbum.id?.toString(),
            title: updatedAlbum.title,
            artist: updatedAlbum.artist,
            genre: updatedAlbum.genre || "",
            description: updatedAlbum.description || "",
            releaseDate: updatedAlbum.releaseDate || "",
            releaseYear: updatedAlbum.releaseYear || "",
            coverImageUrl: updatedAlbum.coverImageUrl || "",
            createdAt: updatedAlbum.createdAt,
            updatedAt: updatedAlbum.updatedAt,
          };

          res.status(200).json(responseAlbum);
        } catch (error) {
          console.error("Error updating album:", error);
          res.status(500).json({ message: "Failed to update album" });
        }
        break;

      case "DELETE":
        try {
          const request = pool.request();
          request.input("AlbumId", sql.Int, id);
          request.input("updatedAt", sql.DateTime2, new Date());

          const result = await request.query(`
            UPDATE [Iftekhari].[Albums] 
            SET isActive = 0, 
                updatedAt = @updatedAt
            WHERE id = @AlbumId
          `);

          if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: "Album not found" });
          }

          res.status(200).json({ message: "Album deleted successfully" });
        } catch (error) {
          console.error("Error deleting album:", error);
          res.status(500).json({ message: "Failed to delete album" });
        }
        break;

      default:
        res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error("Database connection error:", error);
    res.status(500).json({ message: "Database connection failed" });
  }
}
