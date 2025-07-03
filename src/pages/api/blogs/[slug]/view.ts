import type { NextApiRequest, NextApiResponse } from "next";
import { getConnection } from "../../../../framework/lib/db";
import sql from "mssql";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { slug } = req.query;

  if (!slug) {
    return res.status(400).json({ message: "Missing slug" });
  }

  try {
    const pool = await getConnection();

    // First check if the blog exists and is published
    const checkResult = await pool
      .request()
      .input("Slug", sql.NVarChar, slug)
      .query(`
        SELECT id, status, viewCount 
        FROM Iftekhari.BlogPosts 
        WHERE slug = @Slug
      `);

    if (checkResult.recordset.length === 0) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const blog = checkResult.recordset[0];

    // Only increment view count for published blogs
    if (blog.status !== "published") {
      return res.status(403).json({ message: "Cannot track views for unpublished blogs" });
    }

    // Increment view count
    await pool
      .request()
      .input("Slug", sql.NVarChar, slug)
      .query(`
        UPDATE Iftekhari.BlogPosts 
        SET viewCount = viewCount + 1, updatedAt = GETDATE()
        WHERE slug = @Slug
      `);

    // Get updated view count
    const updatedResult = await pool
      .request()
      .input("Slug", sql.NVarChar, slug)
      .query(`
        SELECT viewCount 
        FROM Iftekhari.BlogPosts 
        WHERE slug = @Slug
      `);

    const newViewCount = updatedResult.recordset[0]?.viewCount || 0;

    return res.status(200).json({ 
      success: true, 
      viewCount: newViewCount 
    });

  } catch (error) {
    console.error("View Count API Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
