import type { NextApiRequest, NextApiResponse } from "next";
import { getConnection } from "../../../framework/lib/db";
import sql from "mssql";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  // Check authentication and admin role
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email || session.user?.role !== 'admin') {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { slugs, status } = req.body;

  if (!slugs || !Array.isArray(slugs) || slugs.length === 0) {
    return res.status(400).json({ message: "Invalid slugs array" });
  }

  if (!status || !['draft', 'published'].includes(status)) {
    return res.status(400).json({ message: "Invalid status. Must be 'draft' or 'published'" });
  }

  try {
    const pool = await getConnection();

    // Build the SQL query for bulk update
    const placeholders = slugs.map((_, index) => `@slug${index}`).join(', ');
    const request = pool.request();
    
    // Add parameters for each slug
    slugs.forEach((slug, index) => {
      request.input(`slug${index}`, sql.NVarChar, slug);
    });
    
    request.input("Status", sql.NVarChar, status);

    // Execute bulk update
    const result = await request.query(`
      UPDATE Iftekhari.BlogPosts
      SET status = @Status, updatedAt = GETDATE()
      WHERE slug IN (${placeholders})
    `);

    return res.status(200).json({ 
      success: true, 
      message: `${result.rowsAffected[0]} blog(s) status updated to ${status}`,
      updatedCount: result.rowsAffected[0],
      status: status
    });
  } catch (error) {
    console.error("Bulk Status API Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
