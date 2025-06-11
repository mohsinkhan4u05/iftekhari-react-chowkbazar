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

    // Get user ID from email
    const userResult = await pool
      .request()
      .input("Email", session.user.email)
      .query(`SELECT ID FROM Iftekhari.IftekhariUsers WHERE Email = @Email`);

    const userId = userResult.recordset[0]?.ID;

    if (!userId) {
      return res.status(404).json({ message: "User not found" });
    }

    // Insert bookmark
    await pool.request().input("UserID", userId).input("BookID", bookId).query(`
        IF NOT EXISTS (
          SELECT 1 FROM Iftekhari.Bookmarks WHERE user_id = @UserID AND book_id = @BookID
        )
        INSERT INTO Iftekhari.Bookmarks (user_id, book_id) VALUES (@UserID, @BookID)
      `);

    res.status(200).json({ message: "Book bookmarked successfully" });
  } catch (error) {
    console.error("Bookmark Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
