import type { NextApiRequest, NextApiResponse } from "next";
import { getConnection } from "../../../framework/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const pool = await getConnection();
    const session = await getServerSession(req, res, authOptions);
    
    // Check if user is admin (to include draft posts in stats)
    const isAdmin = session?.user?.email && session.user?.role === 'admin';
    
    // Get published blogs (or all blogs for admins)
    let baseQuery = `
      SELECT category, tags, status 
      FROM Iftekhari.BlogPosts 
    `;
    
    if (!isAdmin) {
      baseQuery += ` WHERE status = 'published' `;
    }

    const result = await pool.query(baseQuery);
    const blogs = result.recordset;

    // Count categories
    const categoryStats: { [key: string]: number } = {};
    const tagStats: { [key: string]: number } = {};

    blogs.forEach((blog: any) => {
      // Count categories
      if (blog.category) {
        categoryStats[blog.category] = (categoryStats[blog.category] || 0) + 1;
      }

      // Count tags
      if (blog.tags) {
        try {
          const tags = JSON.parse(blog.tags);
          tags.forEach((tag: string) => {
            tagStats[tag] = (tagStats[tag] || 0) + 1;
          });
        } catch (error) {
          // Handle invalid JSON gracefully
        }
      }
    });

    // Sort categories and tags by count (descending)
    const sortedCategories = Object.entries(categoryStats)
      .sort(([, a], [, b]) => b - a)
      .map(([name, count]) => ({ name, count }));

    const sortedTags = Object.entries(tagStats)
      .sort(([, a], [, b]) => b - a)
      .map(([name, count]) => ({ name, count }));

    const stats = {
      totalBlogs: blogs.length,
      totalPublished: blogs.filter((blog: any) => blog.status === 'published').length,
      totalDrafts: blogs.filter((blog: any) => blog.status === 'draft').length,
      categories: sortedCategories,
      tags: sortedTags,
      topCategories: sortedCategories.slice(0, 5),
      topTags: sortedTags.slice(0, 10),
    };

    return res.status(200).json(stats);
  } catch (error) {
    console.error("Blog Stats API Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
