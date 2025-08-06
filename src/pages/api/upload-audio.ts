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

  console.log("=== UploadThing Audio Upload API Called ===");
  
  // First, check environment variables
  if (!process.env.UPLOADTHING_TOKEN) {
    console.error("❌ UPLOADTHING_TOKEN not found in environment variables");
    return res.status(500).json({ 
      error: "UploadThing not configured", 
      message: "UPLOADTHING_TOKEN environment variable is missing" 
    });
  }

  console.log("✅ UPLOADTHING_TOKEN found for audio upload");

  try {
    // Parse the form data with larger file size limit for audio
    const form = formidable({
      maxFileSize: 16 * 1024 * 1024, // 16MB for audio files
      keepExtensions: true,
      filter: ({ mimetype }) => mimetype && mimetype.includes("audio"),
    });

    const [fields, files] = await form.parse(req);
    console.log("📄 Audio form parsed successfully");

    const file = files.file?.[0];
    if (!file) {
      return res.status(400).json({ message: "No audio file uploaded" });
    }

    console.log("🎵 Audio file details:", {
      name: file.originalFilename,
      size: file.size,
      type: file.mimetype,
      path: file.filepath
    });

    // Import UploadThing
    console.log("📦 Importing UploadThing SDK for audio...");
    const { UTApi } = await import("uploadthing/server");
    console.log("✅ UploadThing SDK imported successfully");

    // Create UTApi instance
    const utapi = new UTApi();
    console.log("✅ UTApi instance created for audio");

    // Read file
    console.log("📖 Reading audio file...");
    const fileBuffer = await promisify(fs.readFile)(file.filepath);
    console.log("✅ Audio file read successfully, size:", fileBuffer.length);

    // Create File object for UploadThing
    console.log("🔄 Creating File object for UploadThing...");
    
    const fileName = file.originalFilename || `audio-${Date.now()}.mp3`;
    const fileType = file.mimetype || "audio/mpeg";
    
    // Create a File-like object that UploadThing can handle
    const uploadFile = new File([fileBuffer], fileName, { type: fileType });
    console.log("✅ Audio File object created:", {
      name: uploadFile.name,
      size: uploadFile.size,
      type: uploadFile.type
    });

    // Upload to UploadThing
    console.log("☁️ Uploading audio to UploadThing...");
    const uploadResult = await utapi.uploadFiles(uploadFile);
    
    console.log("📊 Audio upload result:", JSON.stringify(uploadResult, null, 2));

    // Check for errors
    if (uploadResult.error) {
      console.error("❌ UploadThing audio error:", uploadResult.error);
      return res.status(500).json({
        error: "UploadThing audio upload failed",
        details: uploadResult.error,
        message: uploadResult.error.message || "Unknown UploadThing error"
      });
    }

    if (!uploadResult.data) {
      console.error("❌ No data returned from UploadThing for audio");
      return res.status(500).json({
        error: "No data returned",
        message: "UploadThing returned no data for audio"
      });
    }

    console.log("🎉 Audio upload successful!");
    console.log("📎 Audio file URL:", uploadResult.data.url);
    console.log("🔑 Audio file key:", uploadResult.data.key);

    // Clean up temp file
    try {
      await promisify(fs.unlink)(file.filepath);
      console.log("🗑️ Temp audio file cleaned up");
    } catch (cleanupError) {
      console.warn("⚠️ Failed to clean up temp audio file:", cleanupError);
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
      type: "audio",
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("💥 Audio upload error:", error);
    console.error("📋 Audio error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : "No stack trace",
      name: error instanceof Error ? error.name : "Unknown error type"
    });

    return res.status(500).json({
      error: "Audio upload failed",
      message: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString()
    });
  }
}
