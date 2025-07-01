import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { getConnection } from "../../../framework/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    query: { bookId },
    method,
  } = req;

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const userEmail = session.user.email;

  if (!bookId) {
    return res.status(400).json({ message: "Missing bookId" });
  }

  try {
    const pool = await getConnection();

    if (method === "GET") {
      const result = await pool
        .request()
        .input("UserEmail", userEmail)
        .input("BookId", bookId).query(`
          SELECT Page 
          FROM Iftekhari.BookmarkPage
          WHERE userEmail = @UserEmail AND bookId = @BookId
        `);

      const page = result.recordset[0]?.Page ?? 0;
      return res.status(200).json({ page });
    }

    if (method === "POST") {
      const { page } = req.body;

      // Check if record exists
      const checkResult = await pool
        .request()
        .input("UserEmail", userEmail)
        .input("BookId", bookId).query(`
          SELECT Page 
          FROM Iftekhari.BookmarkPage
          WHERE userEmail = @UserEmail AND bookId = @BookId
        `);

      const existingPage = checkResult.recordset[0]?.Page;

      if (existingPage !== undefined) {
        if (existingPage !== page) {
          await pool
            .request()
            .input("UserEmail", userEmail)
            .input("BookId", bookId)
            .input("Page", page).query(`
              UPDATE Iftekhari.BookmarkPage
              SET Page = @Page, UpdatedAt = GETDATE()
              WHERE userEmail = @UserEmail AND bookId = @BookId
            `);
        }
      } else {
        await pool
          .request()
          .input("UserEmail", userEmail)
          .input("BookId", bookId)
          .input("Page", page).query(`
            INSERT INTO Iftekhari.BookmarkPage (userEmail, bookId, page, createdAt, updatedAt)
            VALUES (@UserEmail, @BookId, @Page, GETDATE(), GETDATE())
          `);
      }

      return res.status(200).json({ success: true });
    }

    if (method === "DELETE") {
      await pool.request().input("UserEmail", userEmail).input("BookId", bookId)
        .query(`
          DELETE FROM Iftekhari.BookmarkPage
          WHERE userEmail = @UserEmail AND bookId = @BookId
        `);

      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ message: "Method Not Allowed" });
  } catch (error) {
    console.error("Bookmark API Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
