import type { NextApiRequest, NextApiResponse } from "next";
import { getConnection } from "../../../framework/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Check if user is admin
    const session = await getServerSession(req, res, authOptions);
    const isAdmin = session?.user?.email && session.user?.role === 'admin';
    
    if (!isAdmin) {
      return res.status(403).json({ message: "Admin access required" });
    }

    const pool = await getConnection();

    if (req.method === "GET") {
      // Get all soft deleted blogs
      const query = `
        SELECT 
          id, title, slug, summary, coverImage, author, authorEmail, category, tags, status, viewCount, commentCount, createdAt, updatedAt, deletedAt
        FROM Iftekhari.BlogPosts 
        WHERE deletedAt IS NOT NULL
        ORDER BY deletedAt DESC
      `;

      const result = await pool.query(query);

      // Parse tags JSON for each blog
      const deletedBlogs = result.recordset.map((blog: any) => ({
        ...blog,
        tags: blog.tags ? JSON.parse(blog.tags) : [],
      }));

      return res.status(200).json(deletedBlogs);
    }

    if (req.method === "POST") {
      // Restore a soft deleted blog
      const { slug } = req.body;

      if (!slug) {
        return res.status(400).json({ message: "Slug is required" });
      }

      const result = await pool
        .request()
        .input("Slug", slug)
        .query(`
          UPDATE Iftekhari.BlogPosts 
          SET deletedAt = NULL, updatedAt = GETDATE()
          WHERE slug = @Slug AND deletedAt IS NOT NULL
        `);

      if (result.rowsAffected[0] === 0) {
        return res.status(404).json({ message: "Deleted blog not found" });
      }

      return res.status(200).json({ 
        success: true, 
        message: "Blog restored successfully" 
      });
    }

    if (req.method === "DELETE") {
      // Permanently delete a blog (hard delete)
      const { slug } = req.body;

      if (!slug) {
        return res.status(400).json({ message: "Slug is required" });
      }

      const result = await pool
        .request()
        .input("Slug", slug)
        .query(`
          DELETE FROM Iftekhari.BlogPosts 
          WHERE slug = @Slug AND deletedAt IS NOT NULL
        `);

      if (result.rowsAffected[0] === 0) {
        return res.status(404).json({ message: "Deleted blog not found" });
      }

      return res.status(200).json({ 
        success: true, 
        message: "Blog permanently deleted" 
      });
    }

    return res.status(405).json({ message: "Method Not Allowed" });
  } catch (error) {
    console.error("Deleted Blogs API Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
