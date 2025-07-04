import type { NextApiRequest, NextApiResponse } from "next";
import { getConnection } from "../../../framework/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const pool = await getConnection();

    // Get distinct languages from books table with count
    const result = await pool.request().query(`
      SELECT 
        Language,
        COUNT(*) as BookCount
      FROM Iftekhari.Book 
      WHERE Language IS NOT NULL AND Language != ''
      GROUP BY Language
      ORDER BY BookCount DESC
    `);

    // Language image mapping function
    const getLanguageImage = (languageName: string) => {
      const langLower = languageName.toLowerCase();
      if (langLower.includes('english')) {
        return "/assets/images/category/icons/quran.png";
      } else if (langLower.includes('اردو') || langLower.includes('urdu')) {
        return "/assets/images/category/icons/quran1.png";
      } else if (langLower.includes('arabic') || langLower.includes('عربی')) {
        return "/assets/images/category/icons/quran.png";
      } else if (langLower.includes('persian') || langLower.includes('فارسی')) {
        return "/assets/images/category/icons/tasawwuf.png";
      }
      return "/assets/images/category/icons/quran.png";
    };

    const languages = result.recordset.map((lang: any) => {
      const imagePath = getLanguageImage(lang.Language);
      
      return {
        ID: lang.Language,
        Name: lang.Language,
        slug: lang.Language.toLowerCase().replace(/\s+/g, '-'),
        productCount: lang.BookCount,
        icon: imagePath,
        image: {
          id: lang.Language,
          thumbnail: imagePath,
          original: imagePath,
        },
      };
    });

    res.status(200).json({
      success: true,
      message: "Languages retrieved successfully",
      data: languages,
    });
  } catch (error) {
    console.error("Error fetching languages:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
