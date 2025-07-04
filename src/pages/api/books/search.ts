import type { NextApiRequest, NextApiResponse } from "next";
import { getConnection } from "../../../framework/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== "GET") {
      return res.status(405).json({ message: "Method not allowed" });
    }

    const pool = await getConnection();

    const { categories = "", languages = "", page = "1", pageSize = "10" } = req.query;
    const pageNum = parseInt(page as string, 10);
    const size = parseInt(pageSize as string, 10);

    const categoryList = (categories as string)
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean);

    const languageList = (languages as string)
      .split(",")
      .map((l) => l.trim())
      .filter(Boolean);

    let categoryIds: number[] = [];

    if (categoryList.length > 0) {
      const categoryNameList = categoryList
        .map((name) => `'${name.replace(/'/g, "''")}'`)
        .join(",");

      const categoryResult = await pool
        .request()
        .query(
          `SELECT Id FROM Iftekhari.Category WHERE Name IN (${categoryNameList})`
        );

      categoryIds = categoryResult.recordset.map((row: any) => row.Id);
    }

    // Build query with JOIN
    let bookQuery = `
      SELECT B.*, C.Name AS CategoryName
      FROM Iftekhari.Book B
      LEFT JOIN Iftekhari.Category C ON B.CategoryId = C.Id
    `;

    let countQuery = `SELECT COUNT(*) AS total FROM Iftekhari.Book`;

    const whereConditions: string[] = [];
    const countWhereConditions: string[] = [];

    if (categoryIds.length > 0) {
      const ids = categoryIds.join(",");
      whereConditions.push(`B.CategoryId IN (${ids})`);
      countWhereConditions.push(`CategoryId IN (${ids})`);
    }

    if (languageList.length > 0) {
      const languageNameList = languageList
        .map((name) => `'${name.replace(/'/g, "''")}'`)
        .join(",");
      whereConditions.push(`B.Language IN (${languageNameList})`);
      countWhereConditions.push(`Language IN (${languageNameList})`);
    }

    if (whereConditions.length > 0) {
      bookQuery += ` WHERE ${whereConditions.join(' AND ')}`;
      countQuery += ` WHERE ${countWhereConditions.join(' AND ')}`;
    }

    bookQuery += `
      ORDER BY B.Id DESC
      OFFSET ${(pageNum - 1) * size} ROWS FETCH NEXT ${size} ROWS ONLY
    `;

    const booksResult = await pool.request().query(bookQuery);
    const countResult = await pool.request().query(countQuery);

    const books = booksResult.recordset;
    const totalBooks = countResult.recordset[0]?.total || 0;

    return res.status(200).json({
      success: true,
      message: "Books retrieved successfully",
      data: books, // Each book now includes CategoryName
      pagination: {
        currentPage: pageNum,
        pageSize: size,
        totalBooks,
        totalPages: Math.ceil(totalBooks / size),
        hasMorePages: pageNum * size < totalBooks,
        nextPage: pageNum * size < totalBooks ? pageNum + 1 : null,
      },
    });
  } catch (error) {
    console.error("Error fetching books:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
