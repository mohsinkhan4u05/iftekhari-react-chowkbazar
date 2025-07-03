import type { NextApiRequest, NextApiResponse } from "next";
import { getConnection } from "../../../../framework/lib/db";
import sql from "mssql";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    query: { slug },
    method,
  } = req;

  if (!slug) {
    return res.status(400).json({ message: "Missing slug" });
  }

  // Check authentication and admin role
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email || session.user?.role !== 'admin') {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const pool = await getConnection();

    if (method === "PUT") {
      const { status } = req.body;

      if (!status || !['draft', 'published'].includes(status)) {
        return res.status(400).json({ message: "Invalid status. Must be 'draft' or 'published'" });
      }

      // Check if blog exists
      const checkResult = await pool
        .request()
        .input("Slug", sql.NVarChar, slug)
        .query(`SELECT id, status FROM Iftekhari.BlogPosts WHERE slug = @Slug`);

      if (checkResult.recordset.length === 0) {
        return res.status(404).json({ message: "Blog not found" });
      }

      const currentBlog = checkResult.recordset[0];

      // Update status
      await pool
        .request()
        .input("Slug", sql.NVarChar, slug)
        .input("Status", sql.NVarChar, status)
        .query(`
          UPDATE Iftekhari.BlogPosts
          SET status = @Status, updatedAt = GETDATE()
          WHERE slug = @Slug
        `);

      // Log status change for audit trail (optional)
      // You can create a BlogStatusHistory table for this
      
      return res.status(200).json({ 
        success: true, 
        message: `Blog status updated to ${status}`,
        previousStatus: currentBlog.status,
        newStatus: status
      });
    }

    if (method === "GET") {
      // Get current status
      const result = await pool
        .request()
        .input("Slug", sql.NVarChar, slug)
        .query(`SELECT status FROM Iftekhari.BlogPosts WHERE slug = @Slug`);

      if (result.recordset.length === 0) {
        return res.status(404).json({ message: "Blog not found" });
      }

      return res.status(200).json({ 
        status: result.recordset[0].status 
      });
    }

    return res.status(405).json({ message: "Method Not Allowed" });
  } catch (error) {
    console.error("Blog Status API Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
