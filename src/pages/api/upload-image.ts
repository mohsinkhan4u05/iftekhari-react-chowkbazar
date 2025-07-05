import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs from "fs";
import path from "path";

// Allow Next.js to parse form-data
export const config = {
  api: { bodyParser: false },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const uploadDir = path.join(process.cwd(), "public/uploads");
    
    // Ensure uploads directory exists with proper permissions
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true, mode: 0o755 });
      console.log('Created uploads directory:', uploadDir);
    }

    const form = formidable({
      uploadDir,
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB limit
      filter: ({ mimetype }) => {
        // Only allow image files
        return mimetype && mimetype.includes("image");
      },
    });

    form.parse(req, (err, fields, files) => {
      if (err) {
        console.error("Formidable Error:", err);
        return res.status(500).json({ 
          message: "Error parsing file upload", 
          error: err.message 
        });
      }

      const file = files.file?.[0];
      if (!file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const fileName = path.basename(file.filepath);
      const filePath = path.join(uploadDir, fileName);
      
      // Verify file was actually created
      if (!fs.existsSync(filePath)) {
        console.error('File was not created:', filePath);
        return res.status(500).json({ message: "File upload failed" });
      }

      // Set proper file permissions
      try {
        fs.chmodSync(filePath, 0o644);
      } catch (chmodError) {
        console.warn('Could not set file permissions:', chmodError);
      }

      const url = `/uploads/${fileName}`;
      
      console.log('File uploaded successfully:', {
        originalName: file.originalFilename,
        fileName,
        size: file.size,
        url
      });

      return res.status(200).json({ 
        url,
        fileName,
        originalName: file.originalFilename,
        size: file.size
      });
    });
  } catch (error) {
    console.error('Upload API Error:', error);
    return res.status(500).json({ 
      message: "Internal server error", 
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
