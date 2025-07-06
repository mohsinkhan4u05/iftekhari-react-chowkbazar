import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    console.log('Test API called');
    
    const result = {
      timestamp: new Date().toISOString(),
      method: req.method,
      platform: process.platform,
      nodeVersion: process.version,
      cwd: process.cwd(),
      environment: process.env.NODE_ENV,
      headers: req.headers,
    };

    // Check uploads directory
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    
    try {
      const stats = fs.statSync(uploadDir);
      result.uploadsDirectory = {
        exists: true,
        path: uploadDir,
        isDirectory: stats.isDirectory(),
        mode: stats.mode.toString(8),
        size: stats.size,
      };
    } catch (error) {
      result.uploadsDirectory = {
        exists: false,
        path: uploadDir,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }

    // Check if we can write to the directory
    try {
      const testFilePath = path.join(uploadDir, 'test-write.txt');
      fs.writeFileSync(testFilePath, 'test');
      fs.unlinkSync(testFilePath);
      result.writeTest = { success: true };
    } catch (error) {
      result.writeTest = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }

    console.log('Test result:', result);
    
    return res.status(200).json(result);
  } catch (error) {
    console.error('Test API Error:', error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });
  }
}
