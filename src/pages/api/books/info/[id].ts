import type { NextApiRequest, NextApiResponse } from "next";
import { getConnection } from "../../../../framework/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    query: { id },
    method,
  } = req;

  if (method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const pool = await getConnection();

    const result = await pool.request().input("BookId", id).query(`
        SELECT 
          b.ID, b.BookId, b.Name, b.Author, c.Name AS Category,
          b.TotalPages, b.Views, b.Language, b.ImagePath AS Thumbnail,
          b.Tags, b.Translator
        FROM Iftekhari.Book b
        LEFT JOIN Iftekhari.Category c ON b.CategoryId = c.ID
        WHERE b.ID = @BookId
      `);

    const book = result.recordset[0];

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    const domain = "https://admin.silsilaeiftekhari.in";
    const images = Array.from(
      { length: book.TotalPages },
      (_, i) => `${domain}/Uploads/${book.BookId}/${i}.jpg`
    );

    const bookInfo = {
      ...book,
      Images: images,
    };

    res.status(200).json(bookInfo);
  } catch (error) {
    console.error("Book Info API Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
