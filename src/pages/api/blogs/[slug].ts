import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { getConnection } from "../../../framework/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    query: { slug },
    method,
  } = req;

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!slug) {
    return res.status(400).json({ message: "Missing slug" });
  }

  try {
    const pool = await getConnection();

    if (method === "GET") {
      const result = await pool.request().input("Slug", slug).query(`
          SELECT * FROM Iftekhari.BlogPosts WHERE slug = @Slug
        `);

      if (result.recordset.length === 0) {
        return res.status(404).json({ message: "Not found" });
      }

      return res.status(200).json(result.recordset[0]);
    }

    if (method === "POST") {
      const { title, content, summary, coverImage, author } = req.body;

      // Check if blog already exists
      const checkResult = await pool
        .request()
        .input("Slug", slug)
        .query(`SELECT 1 FROM Iftekhari.BlogPosts WHERE slug = @Slug`);

      if (checkResult.recordset.length > 0) {
        // Update existing blog
        await pool
          .request()
          .input("Slug", slug)
          .input("Title", title)
          .input("Content", content)
          .input("Summary", summary)
          .input("CoverImage", coverImage)
          .input("Author", author).query(`
            UPDATE Iftekhari.BlogPosts
            SET title = @Title, content = @Content, summary = @Summary,
                coverImage = @CoverImage, author = @Author, updatedAt = GETDATE()
            WHERE slug = @Slug
          `);
      } else {
        // Insert new blog
        await pool
          .request()
          .input("Slug", slug)
          .input("Title", title)
          .input("Content", content)
          .input("Summary", summary)
          .input("CoverImage", coverImage)
          .input("Author", author).query(`
            INSERT INTO Iftekhari.BlogPosts (slug, title, content, summary, coverImage, author, createdAt, updatedAt)
            VALUES (@Slug, @Title, @Content, @Summary, @CoverImage, @Author, GETDATE(), GETDATE())
          `);
      }

      return res.status(200).json({ success: true });
    }

    if (method === "DELETE") {
      await pool
        .request()
        .input("Slug", slug)
        .query(`DELETE FROM Iftekhari.BlogPosts WHERE slug = @Slug`);

      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ message: "Method Not Allowed" });
  } catch (error) {
    console.error("Blog API Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
