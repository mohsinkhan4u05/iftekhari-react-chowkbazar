import type { NextApiRequest, NextApiResponse } from "next";
import { getConnection } from "../../../framework/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session?.user?.email) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const pool = await getConnection();

    const result = await pool.request().input("UserEmail", session.user.email)
      .query(`
        SELECT 
          bm.bookId, bm.page, b.Name, b.Author, b.ImagePath AS Thumbnail
        FROM Iftekhari.BookmarkPage bm
        INNER JOIN Iftekhari.Book b ON b.ID = bm.bookId
        ORDER BY bm.UpdatedAt DESC
      `);

    res.status(200).json(result.recordset);
  } catch (error) {
    console.error("Bookmarks List API Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
