// pages/api/books/search.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { getConnection } from "../../../framework/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { q } = req.query;

  if (!q || typeof q !== "string") {
    return res.status(400).json({ message: "Missing query" });
  }

  try {
    const pool = await getConnection();

    const result = await pool.request().input("Query", `%${q}%`).query(`
        SELECT TOP 20 ID, BookId, Name, Author, Tags, Language, ImagePath
        FROM Iftekhari.Book
        WHERE Name LIKE @Query OR Author LIKE @Query OR Tags LIKE @Query
        ORDER BY Views DESC
      `);

    res.status(200).json(result.recordset);
  } catch (error) {
    console.error("Search API Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
