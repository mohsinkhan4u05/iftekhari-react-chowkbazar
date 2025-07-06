import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    console.log('Simple upload API called');
    
    // For now, just return a success response to test if the API is working
    const result = {
      message: "Simple upload API is working",
      timestamp: new Date().toISOString(),
      method: req.method,
      contentType: req.headers["content-type"],
      bodySize: JSON.stringify(req.body).length,
    };

    console.log('Simple upload result:', result);
    
    return res.status(200).json(result);
  } catch (error) {
    console.error('Simple upload error:', error);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
