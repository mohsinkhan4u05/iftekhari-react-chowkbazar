import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { getConnection } from "../../../framework/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const pool = await getConnection();

    const result = await pool.query(`
      SELECT 
        id, title, slug, summary, coverImage, author, createdAt 
      FROM Iftekhari.BlogPosts 
      ORDER BY createdAt DESC
    `);

    return res.status(200).json(result.recordset);
  } catch (error) {
    console.error("Blog List API Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
