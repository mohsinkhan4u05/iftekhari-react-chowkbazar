import type { NextApiRequest, NextApiResponse } from "next";
import { getConnection } from "../../../framework/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const pool = await getConnection();

    const result = await pool.request().query(`
      SELECT Id, Name FROM Iftekhari.Category WHERE ID IN (13,14,3,10,6)
    `);

    const categories = result.recordset.map((cat: any) => ({
      Id: cat.Id,
      Name: cat.Name,
      Slug: "", // as per your .NET structure
      ProductCount: 10, // static
      Icon: `/assets/images/category/books/${cat.Name}.png`,
      Tags: null,
      Image: {
        Id: cat.Id,
        Thumbnail: `/assets/images/category/books/${cat.Name}.png`,
        Original: `/assets/images/category/books/${cat.Name}.png`,
      },
    }));

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
