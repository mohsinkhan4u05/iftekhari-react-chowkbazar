import type { NextApiRequest, NextApiResponse } from "next";
import { getConnection } from "../../../framework/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Book ID is required" });
  }

  try {
    const pool = await getConnection();

    // Increment the Views column for the specified Book ID
    await pool.request().input("BookId", id).query(`
        UPDATE Iftekhari.Book
        SET Views = ISNULL(Views, 0) + 1
        WHERE ID = @BookId
      `);

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error updating views:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
