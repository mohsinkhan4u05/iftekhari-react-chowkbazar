import type { NextApiRequest, NextApiResponse } from "next";
import { getConnection } from "../../../../framework/lib/db";
import sql from "mssql";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { slug } = req.query;

  console.log('Comments API - Request details:', {
    method: req.method,
    url: req.url,
    query: req.query,
    slug,
    slugType: typeof slug
  });

  if (!slug || typeof slug !== 'string') {
    console.error('Comments API - Missing or invalid slug:', { slug, type: typeof slug });
    return res.status(400).json({ message: "Missing blog slug" });
  }

  try {
    const pool = await getConnection();
    const session = await getServerSession(req, res, authOptions);

    // Get blog post ID from slug
    const blogResult = await pool
      .request()
      .input("Slug", sql.NVarChar, slug)
      .query(`SELECT id FROM Iftekhari.BlogPosts WHERE slug = @Slug`);

    if (blogResult.recordset.length === 0) {
      return res.status(404).json({ message: "Blog post not found" });
    }

    const blogPostId = blogResult.recordset[0].id;

    if (req.method === "GET") {
      // Get comments for the blog post
      const result = await pool
        .request()
        .input("BlogPostId", sql.Int, blogPostId)
        .query(`
          WITH CommentHierarchy AS (
            -- Get root comments (no parent)
            SELECT 
              id, blogPostId, parentCommentId, authorName, authorEmail, 
              content, status, createdAt, updatedAt, 0 as level
            FROM Iftekhari.BlogComments 
            WHERE blogPostId = @BlogPostId 
              AND parentCommentId IS NULL 
              AND status = 'approved'
            
            UNION ALL
            
            -- Get replies (recursive)
            SELECT 
              c.id, c.blogPostId, c.parentCommentId, c.authorName, c.authorEmail,
              c.content, c.status, c.createdAt, c.updatedAt, ch.level + 1
            FROM Iftekhari.BlogComments c
            INNER JOIN CommentHierarchy ch ON c.parentCommentId = ch.id
            WHERE c.status = 'approved'
          )
          SELECT * FROM CommentHierarchy 
          ORDER BY level, createdAt ASC
        `);

      const comments = result.recordset.map((comment: any) => ({
        ...comment,
        authorEmail: undefined, // Don't expose email addresses
      }));

      return res.status(200).json(comments);
    }

    if (req.method === "POST") {
      // Create new comment (requires authentication)
      if (!session?.user?.email) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const { content, parentCommentId } = req.body;

      if (!content?.trim()) {
        return res.status(400).json({ message: "Comment content is required" });
      }

      // Validate parent comment if provided
      if (parentCommentId) {
        const parentResult = await pool
          .request()
          .input("ParentId", sql.Int, parentCommentId)
          .input("BlogPostId", sql.Int, blogPostId)
          .query(`
            SELECT id FROM Iftekhari.BlogComments 
            WHERE id = @ParentId AND blogPostId = @BlogPostId AND status = 'approved'
          `);

        if (parentResult.recordset.length === 0) {
          return res.status(400).json({ message: "Invalid parent comment" });
        }
      }

      // Insert new comment
      await pool
        .request()
        .input("BlogPostId", sql.Int, blogPostId)
        .input("ParentCommentId", sql.Int, parentCommentId || null)
        .input("AuthorName", sql.NVarChar, session.user.name || session.user.email)
        .input("AuthorEmail", sql.NVarChar, session.user.email)
        .input("Content", sql.NText, content.trim())
        .query(`
          INSERT INTO Iftekhari.BlogComments 
          (blogPostId, parentCommentId, authorName, authorEmail, content, status, createdAt, updatedAt)
          VALUES (@BlogPostId, @ParentCommentId, @AuthorName, @AuthorEmail, @Content, 'approved', GETDATE(), GETDATE())
        `);

      // Update comment count in blog post
      await pool
        .request()
        .input("BlogPostId", sql.Int, blogPostId)
        .query(`
          UPDATE Iftekhari.BlogPosts 
          SET commentCount = (
            SELECT COUNT(*) FROM Iftekhari.BlogComments 
            WHERE blogPostId = @BlogPostId AND status = 'approved'
          )
          WHERE id = @BlogPostId
        `);

      return res.status(201).json({ 
        message: "Comment added successfully",
        status: "approved" 
      });
    }

    return res.status(405).json({ message: "Method not allowed" });
  } catch (error) {
    console.error("Comments API Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
