import type { NextApiRequest, NextApiResponse } from "next";
import { getConnection } from "../../../framework/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { limit = "10", offset = "0", type = "popular" } = req.query;
    const pool = await getConnection();

    let query = `SELECT * FROM Iftekhari.Book`;
    const conditions: string[] = [];

    if (type === "popular") {
      conditions.push("Popular = 1");
    } else if (type === "editor-choice") {
      conditions.push("EditorChoice = 1");
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(" AND ")}`;
    }

    if (type === "new-arrival") {
      query += " ORDER BY ID DESC";
    } else {
      query += " ORDER BY ID ASC";
    }

    query += ` OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY`;

    const result = await pool.request().query(query);

    res.status(200).json(result.recordset);
  } catch (error) {
    console.error("SQL error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
