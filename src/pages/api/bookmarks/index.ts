import type { NextApiRequest, NextApiResponse } from "next";
import { getConnection } from "../../../framework/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const session = await getServerSession(req, res, authOptions);
    
    if (!session?.user?.email) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const pool = await getConnection();
    const userEmail = session.user.email;

    if (req.method === "GET") {
      // Get all bookmarks for the user
      const query = `
        SELECT 
          b.id, b.blogId, b.createdAt,
          bp.title, bp.slug, bp.summary, bp.coverImage, bp.author, bp.category, bp.createdAt as blogCreatedAt
        FROM Iftekhari.Bookmarks b
        INNER JOIN Iftekhari.BlogPosts bp ON b.blogId = bp.id
        WHERE b.userEmail = @userEmail
        ORDER BY b.createdAt DESC
      `;
      
      const request = pool.request();
      request.input('userEmail', userEmail);
      const result = await request.query(query);
      
      return res.status(200).json(result.recordset);
    }

    if (req.method === "POST") {
      // Add a bookmark
      const { blogId, blogSlug } = req.body;
      
      if (!blogId && !blogSlug) {
        return res.status(400).json({ message: "Blog ID or slug is required" });
      }

      let actualBlogId = blogId;
      
      // If only slug is provided, get the blog ID
      if (!blogId && blogSlug) {
        const blogQuery = `SELECT id FROM Iftekhari.BlogPosts WHERE slug = @slug`;
        const blogRequest = pool.request();
        blogRequest.input('slug', blogSlug);
        const blogResult = await blogRequest.query(blogQuery);
        
        if (blogResult.recordset.length === 0) {
          return res.status(404).json({ message: "Blog not found" });
        }
        
        actualBlogId = blogResult.recordset[0].id;
      }

      // Check if bookmark already exists
      const checkQuery = `
        SELECT id FROM Iftekhari.Bookmarks 
        WHERE userEmail = @userEmail AND blogId = @blogId
      `;
      
      const checkRequest = pool.request();
      checkRequest.input('userEmail', userEmail);
      checkRequest.input('blogId', actualBlogId);
      const checkResult = await checkRequest.query(checkQuery);
      
      if (checkResult.recordset.length > 0) {
        return res.status(409).json({ message: "Bookmark already exists" });
      }

      // Add bookmark
      const insertQuery = `
        INSERT INTO Iftekhari.Bookmarks (userEmail, blogId, createdAt)
        VALUES (@userEmail, @blogId, @createdAt);
        SELECT SCOPE_IDENTITY() as id;
      `;
      
      const insertRequest = pool.request();
      insertRequest.input('userEmail', userEmail);
      insertRequest.input('blogId', actualBlogId);
      insertRequest.input('createdAt', new Date());
      const insertResult = await insertRequest.query(insertQuery);
      
      return res.status(201).json({ 
        message: "Bookmark added successfully", 
        id: insertResult.recordset[0].id 
      });
    }

    if (req.method === "DELETE") {
      // Remove a bookmark
      const { blogId, blogSlug } = req.body;
      
      if (!blogId && !blogSlug) {
        return res.status(400).json({ message: "Blog ID or slug is required" });
      }

      let actualBlogId = blogId;
      
      // If only slug is provided, get the blog ID
      if (!blogId && blogSlug) {
        const blogQuery = `SELECT id FROM Iftekhari.BlogPosts WHERE slug = @slug`;
        const blogRequest = pool.request();
        blogRequest.input('slug', blogSlug);
        const blogResult = await blogRequest.query(blogQuery);
        
        if (blogResult.recordset.length === 0) {
          return res.status(404).json({ message: "Blog not found" });
        }
        
        actualBlogId = blogResult.recordset[0].id;
      }

      // Remove bookmark
      const deleteQuery = `
        DELETE FROM Iftekhari.Bookmarks 
        WHERE userEmail = @userEmail AND blogId = @blogId
      `;
      
      const deleteRequest = pool.request();
      deleteRequest.input('userEmail', userEmail);
      deleteRequest.input('blogId', actualBlogId);
      const deleteResult = await deleteRequest.query(deleteQuery);
      
      if (deleteResult.rowsAffected[0] === 0) {
        return res.status(404).json({ message: "Bookmark not found" });
      }
      
      return res.status(200).json({ message: "Bookmark removed successfully" });
    }

    res.setHeader("Allow", ["GET", "POST", "DELETE"]);
    return res.status(405).json({ message: "Method not allowed" });
  } catch (error) {
    console.error("Bookmarks API Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
