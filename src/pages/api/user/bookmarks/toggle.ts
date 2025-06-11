// /pages/api/user/bookmarks/toggle.ts
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import type { NextApiRequest, NextApiResponse } from "next";
import { getConnection } from "../../../../framework/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user?.email) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { bookId } = req.body;

  try {
    const pool = await getConnection();

    const userResult = await pool
      .request()
      .input("Email", session.user.email)
      .query(`SELECT ID FROM Iftekhari.IftekhariUsers WHERE Email = @Email`);

    const userId = userResult.recordset[0]?.ID;
    if (!userId) return res.status(404).json({ message: "User not found" });

    // Check if bookmarked
    const bookmarkResult = await pool
      .request()
      .input("UserID", userId)
      .input("BookID", bookId).query(`
        SELECT 1 FROM Iftekhari.Bookmarks WHERE user_id = @UserID AND book_id = @BookID
      `);

    if (bookmarkResult.recordset.length > 0) {
      // Remove bookmark
      await pool.request().input("UserID", userId).input("BookID", bookId)
        .query(`
          DELETE FROM Iftekhari.Bookmarks WHERE user_id = @UserID AND book_id = @BookID
        `);

      return res
        .status(200)
        .json({ message: "Bookmark removed", bookmarked: false });
    } else {
      // Add bookmark
      await pool.request().input("UserID", userId).input("BookID", bookId)
        .query(`
          INSERT INTO Iftekhari.Bookmarks (user_id, book_id) VALUES (@UserID, @BookID)
        `);

      return res
        .status(200)
        .json({ message: "Bookmark added", bookmarked: true });
    }
  } catch (error) {
    console.error("Toggle Bookmark Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
