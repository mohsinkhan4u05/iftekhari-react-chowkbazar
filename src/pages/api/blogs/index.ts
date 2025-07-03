import type { NextApiRequest, NextApiResponse } from "next";
import { getConnection } from "../../../framework/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const pool = await getConnection();
    const session = await getServerSession(req, res, authOptions);
    
    // Check if user is admin
    const isAdmin = session?.user?.email && session.user?.role === 'admin';
    
    // Allow manual testing with ?status=published or ?status=all
    const { status } = req.query;
    
    let query = `
      SELECT 
        id, title, slug, summary, coverImage, author, authorEmail, category, tags, status, viewCount, commentCount, createdAt, updatedAt
      FROM Iftekhari.BlogPosts 
      WHERE deletedAt IS NULL
    `;
    
    // Apply status filtering logic
    let shouldFilter = false;
    
    // Manual override via query parameter
    if (status === 'published') {
      shouldFilter = true;
    } else if (status === 'all') {
      shouldFilter = false;
    } else {
      // Default behavior: filter for non-admin users
      shouldFilter = !isAdmin;
    }
    
    if (shouldFilter) {
      query += ` AND status = 'published' `;
    }
    
    query += ` ORDER BY createdAt DESC`;

    const result = await pool.query(query);

    // Parse tags JSON for each blog
    const blogs = result.recordset.map((blog: any) => ({
      ...blog,
      tags: blog.tags ? JSON.parse(blog.tags) : [],
    }));

    return res.status(200).json(blogs);
  } catch (error) {
    console.error("Blog List API Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
