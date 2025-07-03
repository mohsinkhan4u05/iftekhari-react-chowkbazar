import type { NextApiRequest, NextApiResponse } from "next";
import { getConnection } from "../../../framework/lib/db";
import sql from "mssql";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

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

  try {
    const pool = await getConnection();

    if (method === "GET") {
      const result = await pool.request().input("Slug", slug).query(`
          SELECT id, title, slug, content, summary, coverImage, author, authorEmail, category, tags, status, viewCount, commentCount, createdAt, updatedAt 
          FROM Iftekhari.BlogPosts WHERE slug = @Slug AND deletedAt IS NULL
        `);

      if (result.recordset.length === 0) {
        return res.status(404).json({ message: "Not found" });
      }

      const blog = result.recordset[0];
      
      // Check if blog is draft and user is not admin
      if (blog.status === 'draft') {
        const session = await getServerSession(req, res, authOptions);
        const isAdmin = session?.user?.email && session.user?.role === 'admin';
        
        if (!isAdmin) {
          return res.status(404).json({ message: "Not found" });
        }
      }

      return res.status(200).json(blog);
    }

    if (method === "POST") {
      const {
        title,
        content,
        summary,
        coverImage,
        author,
        authorEmail,
        category,
        tags,
        status,
      } = req.body;
      
      
      // Get session for auto-populating author data if not provided
      const session = await getServerSession(req, res, authOptions);
      const finalAuthor = author || session?.user?.name || session?.user?.email || 'Anonymous';
      const finalAuthorEmail = authorEmail || session?.user?.email || '';

      // Check if blog already exists (and not deleted)
      const checkResult = await pool
        .request()
        .input("Slug", sql.NVarChar, slug)
        .query(`SELECT 1 FROM Iftekhari.BlogPosts WHERE slug = @Slug AND deletedAt IS NULL`);

      if (checkResult.recordset.length > 0) {
        // Update existing blog
        await pool
          .request()
          .input("Slug", sql.NVarChar, slug)
          .input("Title", sql.NVarChar, title)
          .input("Content", sql.NText, content)
          .input("Summary", sql.NVarChar, summary)
          .input("CoverImage", sql.NVarChar, coverImage)
          .input("Author", sql.NVarChar, finalAuthor)
          .input("AuthorEmail", sql.NVarChar, finalAuthorEmail)
          .input("Category", sql.NVarChar, category || null)
          .input("Tags", sql.NVarChar, tags ? JSON.stringify(tags) : null)
          .input("Status", sql.NVarChar, status || "draft").query(`
            UPDATE Iftekhari.BlogPosts
            SET title = @Title, content = @Content, summary = @Summary,
                coverImage = @CoverImage, author = @Author, authorEmail = @AuthorEmail, 
                category = @Category, tags = @Tags, status = @Status, updatedAt = GETDATE()
            WHERE slug = @Slug
          `);
      } else {
        // Insert new blog
        await pool
          .request()
          .input("Slug", sql.NVarChar, slug)
          .input("Title", sql.NVarChar, title)
          .input("Content", sql.NText, content)
          .input("Summary", sql.NVarChar, summary)
          .input("CoverImage", sql.NVarChar, coverImage)
          .input("Author", sql.NVarChar, finalAuthor)
          .input("AuthorEmail", sql.NVarChar, finalAuthorEmail)
          .input("Category", sql.NVarChar, category || null)
          .input("Tags", sql.NVarChar, tags ? JSON.stringify(tags) : null)
          .input("Status", sql.NVarChar, status || "draft").query(`
            INSERT INTO Iftekhari.BlogPosts (slug, title, content, summary, coverImage, author, authorEmail, category, tags, status, createdAt, updatedAt)
            VALUES (@Slug, @Title, @Content, @Summary, @CoverImage, @Author, @AuthorEmail, @Category, @Tags, @Status, GETDATE(), GETDATE())
          `);
      }

      return res.status(200).json({ success: true });
    }

    if (method === "DELETE") {
      // Check if user is admin
      const session = await getServerSession(req, res, authOptions);
      const isAdmin = session?.user?.email && session.user?.role === 'admin';
      
      if (!isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }

      // Soft delete - set deletedAt timestamp
      const result = await pool
        .request()
        .input("Slug", slug)
        .query(`
          UPDATE Iftekhari.BlogPosts 
          SET deletedAt = GETDATE() 
          WHERE slug = @Slug AND deletedAt IS NULL
        `);

      if (result.rowsAffected[0] === 0) {
        return res.status(404).json({ message: "Blog not found or already deleted" });
      }

      return res.status(200).json({ 
        success: true, 
        message: "Blog soft deleted successfully" 
      });
    }

    return res.status(405).json({ message: "Method Not Allowed" });
  } catch (error) {
    console.error("Blog API Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
