import type { NextApiRequest, NextApiResponse } from "next";
import { getConnection } from "../../../framework/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const pool = await getConnection();

    // Get categories with actual book counts
    const result = await pool.request().query(`
      SELECT 
        C.Id, 
        C.Name,
        COUNT(B.ID) as BookCount
      FROM Iftekhari.Category C
      LEFT JOIN Iftekhari.Book B ON C.Id = B.CategoryId
      WHERE C.ID IN (13,14,3,10,6)
      GROUP BY C.Id, C.Name
      ORDER BY BookCount DESC
    `);

    // Category image mapping function
    const getCategoryImage = (categoryName: string) => {
      const imageMap: { [key: string]: string } = {
        "Hadees": "/assets/images/category/books/Hadees.png",
        "Poetry": "/assets/images/category/books/Poetry-Kalaam.png", 
        "Tasawwuf": "/assets/images/category/books/Tasawwuf.png",
        "Biography": "/assets/images/category/books/Swan-e-Hayaat-Biography.png",
        "Wahdat": "/assets/images/category/books/Wahdat-Ul-Wajood.png",
        "Seerat": "/assets/images/category/Seerat.png",
        "Quran": "/assets/images/category/Quran.png",
        "Fiqh": "/assets/images/category/Fiqh.png",
      };
      return imageMap[categoryName] || "/assets/images/category/icons/quran.png";
    };

    const categories = result.recordset.map((cat: any) => {
      const imagePath = getCategoryImage(cat.Name);
      return {
        ID: cat.Id,
        Name: cat.Name,
        slug: cat.Name.toLowerCase().replace(/\s+/g, '-'),
        productCount: cat.BookCount,
        icon: imagePath,
        image: {
          id: cat.Id,
          thumbnail: imagePath,
          original: imagePath,
        },
      };
    });

    res.status(200).json({
      success: true,
      message: "Categories retrieved successfully",
      data: categories,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
