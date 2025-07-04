import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import { getConnection } from "../../../../framework/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.email) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { bookIds } = req.body;
    
    if (!bookIds || !Array.isArray(bookIds) || bookIds.length === 0) {
      return res.status(400).json({ message: "Invalid book IDs" });
    }

    // Limit batch size to prevent abuse
    if (bookIds.length > 100) {
      return res.status(400).json({ message: "Too many book IDs. Maximum 100 allowed." });
    }

    const pool = await getConnection();
    
    // First get the user ID from IftekhariUsers table (matching existing API pattern)
    const userResult = await pool
      .request()
      .input("Email", session.user.email)
      .query("SELECT ID FROM Iftekhari.IftekhariUsers WHERE Email = @Email");

    const userId = userResult.recordset[0]?.ID;

    if (!userId) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Create comma-separated list of book IDs for SQL IN clause
    const bookIdList = bookIds.map(id => parseInt(id)).filter(id => !isNaN(id));
    if (bookIdList.length === 0) {
      return res.status(400).json({ message: "No valid book IDs provided" });
    }
    
    // Use the correct table and column names matching existing API
    const bookIdPlaceholders = bookIdList.map(id => id).join(',');
    const query = `
      SELECT book_id 
      FROM Iftekhari.Bookmarks 
      WHERE user_id = ${userId} AND book_id IN (${bookIdPlaceholders})
    `;
    
    const result = await pool.request().query(query);

    // Create a map of bookmarked book IDs
    const bookmarkedIds = new Set(result.recordset.map((row: any) => row.book_id));
    
    // Create response object with bookmark status for each requested book
    const bookmarkStatus: { [key: number]: boolean } = {};
    bookIds.forEach((bookId: number) => {
      bookmarkStatus[bookId] = bookmarkedIds.has(bookId);
    });

    res.status(200).json({
      success: true,
      bookmarks: bookmarkStatus
    });
  } catch (error) {
    console.error("Batch bookmark check error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error" 
    });
  }
}
