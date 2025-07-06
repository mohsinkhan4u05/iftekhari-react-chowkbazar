import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs from "fs";
import { promisify } from "util";

// Disable body parser for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  console.log("=== UploadThing Direct Upload API Called ===");
  
  // First, check environment variables
  if (!process.env.UPLOADTHING_TOKEN) {
    console.error("❌ UPLOADTHING_TOKEN not found in environment variables");
    return res.status(500).json({ 
      error: "UploadThing not configured", 
      message: "UPLOADTHING_TOKEN environment variable is missing" 
    });
  }

  console.log("✅ UPLOADTHING_TOKEN found:", {
    length: process.env.UPLOADTHING_TOKEN.length,
    prefix: process.env.UPLOADTHING_TOKEN.substring(0, 8) + "...",
    startsWithSk: process.env.UPLOADTHING_TOKEN.startsWith("sk_")
  });

  try {
    // Parse the form data
    const form = formidable({
      maxFileSize: 4 * 1024 * 1024, // 4MB
      keepExtensions: true,
      filter: ({ mimetype }) => mimetype && mimetype.includes("image"),
    });

    const [fields, files] = await form.parse(req);
    console.log("📄 Form parsed successfully");

    const file = files.file?.[0];
    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    console.log("📁 File details:", {
      name: file.originalFilename,
      size: file.size,
      type: file.mimetype,
      path: file.filepath
    });

    // Import UploadThing
    console.log("📦 Importing UploadThing SDK...");
    const { UTApi } = await import("uploadthing/server");
    console.log("✅ UploadThing SDK imported successfully");

    // Create UTApi instance
    const utapi = new UTApi();
    console.log("✅ UTApi instance created");

    // Read file
    console.log("📖 Reading file...");
    const fileBuffer = await promisify(fs.readFile)(file.filepath);
    console.log("✅ File read successfully, size:", fileBuffer.length);

    // Create File object for UploadThing
    console.log("🔄 Creating File object for UploadThing...");
    
    // Use a more compatible approach
    const fileName = file.originalFilename || `image-${Date.now()}.jpg`;
    const fileType = file.mimetype || "image/jpeg";
    
    // Create a File-like object that UploadThing can handle
    const uploadFile = new File([fileBuffer], fileName, { type: fileType });
    console.log("✅ File object created:", {
      name: uploadFile.name,
      size: uploadFile.size,
      type: uploadFile.type
    });

    // Upload to UploadThing
    console.log("☁️ Uploading to UploadThing...");
    const uploadResult = await utapi.uploadFiles(uploadFile);
    
    console.log("📊 Upload result:", JSON.stringify(uploadResult, null, 2));

    // Check for errors
    if (uploadResult.error) {
      console.error("❌ UploadThing error:", uploadResult.error);
      return res.status(500).json({
        error: "UploadThing upload failed",
        details: uploadResult.error,
        message: uploadResult.error.message || "Unknown UploadThing error"
      });
    }

    if (!uploadResult.data) {
      console.error("❌ No data returned from UploadThing");
      return res.status(500).json({
        error: "No data returned",
        message: "UploadThing returned no data"
      });
    }

    console.log("🎉 Upload successful!");
    console.log("📎 File URL:", uploadResult.data.url);
    console.log("🔑 File key:", uploadResult.data.key);

    // Clean up temp file
    try {
      await promisify(fs.unlink)(file.filepath);
      console.log("🗑️ Temp file cleaned up");
    } catch (cleanupError) {
      console.warn("⚠️ Failed to clean up temp file:", cleanupError);
    }

    // Return success
    return res.status(200).json({
      success: true,
      url: uploadResult.data.url,
      key: uploadResult.data.key,
      name: uploadResult.data.name,
      size: uploadResult.data.size,
      originalName: file.originalFilename,
      mimetype: file.mimetype,
      provider: "uploadthing",
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("💥 Upload error:", error);
    console.error("📋 Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : "No stack trace",
      name: error instanceof Error ? error.name : "Unknown error type"
    });

    return res.status(500).json({
      error: "Upload failed",
      message: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString()
    });
  }
}
