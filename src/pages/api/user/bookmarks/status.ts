// /pages/api/user/bookmarks/status.ts
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

  const { bookId } = req.query;

  try {
    const pool = await getConnection();
    const userResult = await pool
      .request()
      .input("Email", session.user.email)
      .query(`SELECT ID FROM Iftekhari.IftekhariUsers WHERE Email = @Email`);
    const userId = userResult.recordset[0]?.ID;

    const result = await pool
      .request()
      .input("UserID", userId)
      .input("BookID", Number(bookId)).query(`
        SELECT 1 FROM Iftekhari.Bookmarks WHERE user_id = @UserID AND book_id = @BookID
      `);

    res.status(200).json({ bookmarked: result.recordset.length > 0 });
  } catch (err) {
    console.error("Bookmark status error:", err);
    res.status(500).json({ message: "Error checking bookmark status" });
  }
}
