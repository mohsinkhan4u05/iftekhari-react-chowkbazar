import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import type { NextApiRequest, NextApiResponse } from "next";
import { getConnection } from "../../../../framework/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user?.email) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const pool = await getConnection();

    // Get user ID from email
    const userResult = await pool.request().input("Email", session.user.email)
      .query(`
        SELECT ID FROM Iftekhari.IftekhariUsers WHERE Email = @Email
      `);

    const userId = userResult.recordset[0]?.ID;
    if (!userId) return res.status(404).json({ message: "User not found" });

    // Get all bookmarked books for this user
    const result = await pool.request().input("UserID", userId).query(`
        SELECT b.*
        FROM Iftekhari.Bookmarks bm
        INNER JOIN Iftekhari.Book b ON bm.book_id = b.ID
        WHERE bm.user_id = @UserID
      `);

    res.status(200).json(result.recordset);
  } catch (err) {
    console.error("Bookmark list fetch error:", err);
    res.status(500).json({ message: "Error fetching wishlist" });
  }
}
