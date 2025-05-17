import type { NextApiRequest, NextApiResponse } from "next";
import { getConnection } from "../../../framework/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { limit = "10", offset = "0", type = "popular" } = req.query;
    const pool = await getConnection();

    const conditions: string[] = [];

    // Default ORDER BY
    let orderByField = "b.ID";
    let orderDirection = "ASC";

    if (type === "popular") {
      conditions.push("b.Popular = 1");
    } else if (type === "editor-choice") {
      conditions.push("b.EditorChoice = 1");
    } else if (type === "new-arrival") {
      orderDirection = "DESC";
    }

    // Start query — 🔥 removed the trailing comma!
    let query = `
      SELECT 
        b.*, 
        c.Name AS CategoryName
      FROM Iftekhari.Book b
      LEFT JOIN Iftekhari.Category c ON b.CategoryID = c.ID
    `;

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(" AND ")}`;
    }

    const safeOrderBy = `${orderByField} ${orderDirection}`;

    query += ` ORDER BY ${safeOrderBy} OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY`;

    const result = await pool
      .request()
      .input("offset", Number(offset))
      .input("limit", Number(limit))
      .query(query);

    res.status(200).json(result.recordset);
  } catch (error) {
    console.error("SQL error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
