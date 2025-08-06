import { NextApiRequest, NextApiResponse } from "next";
import { getConnection } from "../../../framework/lib/db";
import sql from "mssql";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  try {
    const pool = await getConnection();

    switch (method) {
      case "GET":
        try {
          const request = pool.request();
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
            WHERE isActive = 1
            ORDER BY title ASC
          `);

          const albums = result.recordset.map((album) => ({
            id: album.id?.toString(),
            title: album.title || "Unknown Album",
            artist: album.artist || "Unknown Artist",
            genre: album.genre || "",
            description: album.description || "",
            releaseDate: album.releaseDate || "",
            releaseYear: album.releaseYear || "",
            coverImageUrl: album.coverImageUrl || "",
            totalTracks: album.totalTracks || 0,
            createdAt: album.createdAt || new Date().toISOString(),
          }));

          res.status(200).json(albums);
        } catch (error) {
          console.error("Error fetching albums:", error);
          res.status(500).json({ message: "Failed to fetch albums" });
        }
        break;

      case "POST":
        try {
          const {
            title,
            artist,
            genre,
            description,
            releaseDate,
            releaseYear,
            coverImageUrl,
          } = req.body;

          if (!title) {
            return res.status(400).json({ message: "Title is required" });
          }

          if (!artist) {
            return res.status(400).json({ message: "Artist is required" });
          }

          const request = pool.request();
          request.input("title", sql.NVarChar, title);
          request.input("artist", sql.NVarChar, artist);
          request.input("genre", sql.NVarChar, genre || "");
          request.input("description", sql.NVarChar, description || "");
          request.input(
            "releaseDate",
            sql.DateTime2,
            releaseDate ? new Date(releaseDate) : null
          );
          request.input(
            "releaseYear",
            sql.Int,
            releaseYear ? parseInt(releaseYear) : new Date().getFullYear()
          );
          request.input("coverImageUrl", sql.NVarChar, coverImageUrl || "");
          request.input("totalTracks", sql.Int, 0);
          request.input("totalDuration", sql.Int, 0);
          request.input("status", sql.NVarChar, "draft");
          request.input("isActive", sql.Bit, true);
          request.input("createdAt", sql.DateTime2, new Date());
          request.input("updatedAt", sql.DateTime2, new Date());

          const result = await request.query(`
            INSERT INTO [Iftekhari].[Albums] 
            (title, artist, genre, description, releaseDate, releaseYear, coverImageUrl, totalTracks, totalDuration, status, isActive, createdAt, updatedAt)
            OUTPUT INSERTED.id, INSERTED.title, INSERTED.artist, INSERTED.genre, 
                   INSERTED.description, INSERTED.releaseDate, INSERTED.releaseYear, INSERTED.coverImageUrl, INSERTED.createdAt
            VALUES (@title, @artist, @genre, @description, @releaseDate, @releaseYear, @coverImageUrl, @totalTracks, @totalDuration, @status, @isActive, @createdAt, @updatedAt)
          `);

          const newAlbum = result.recordset[0];
          const responseAlbum = {
            id: newAlbum.id?.toString(),
            title: newAlbum.title,
            artist: newAlbum.artist,
            genre: newAlbum.genre || "",
            description: newAlbum.description || "",
            releaseDate: newAlbum.releaseDate || "",
            releaseYear: newAlbum.releaseYear || "",
            coverImageUrl: newAlbum.coverImageUrl || "",
            createdAt: newAlbum.createdAt,
          };

          res.status(201).json(responseAlbum);
        } catch (error) {
          console.error("Error creating album:", error);
          res.status(500).json({ message: "Failed to create album" });
        }
        break;

      default:
        res.setHeader("Allow", ["GET", "POST"]);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error("Database connection error:", error);
    res.status(500).json({ message: "Database connection failed" });
  }
}
