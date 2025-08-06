import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs from "fs";
import path from "path";
import axios from "axios";

// Disable Next.js built-in body parser for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper function to parse form using formidable
const parseForm = (
  req: NextApiRequest
): Promise<[formidable.Fields, formidable.Files]> =>
  new Promise((resolve, reject) => {
    const form = formidable({
      maxFileSize: 20 * 1024 * 1024, // 20MB
      keepExtensions: true,
      multiples: false,
    });

    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve([fields, files]);
    });
  });

const uploadHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  console.log("Starting upload process");

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Validate required env vars
  const {
    BUNNY_STORAGE_HOST,
    BUNNY_STORAGE_USER,
    BUNNY_STORAGE_PASSWORD,
    BUNNY_PULL_ZONE_URL,
  } = process.env;

  if (!BUNNY_STORAGE_HOST || !BUNNY_STORAGE_USER || !BUNNY_STORAGE_PASSWORD) {
    console.error("Bunny CDN configuration missing");
    return res.status(500).json({
      error: "Bunny CDN configuration missing",
      message: "Ensure BUNNY_STORAGE_HOST, USER, and PASSWORD are set in .env.local",
    });
  }

  console.log("Environment variables validated");

  try {
    const [fields, files] = await parseForm(req);
    console.log("Form parsed");

    const file = files.file as formidable.File;
    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    console.log(`Uploading file: ${file.originalFilename}`);

    const originalName = file.originalFilename || "upload";
    const fileExtension = path.extname(originalName);
    const baseName = path.basename(originalName, fileExtension);
    const uniqueFileName = `${baseName}-${Date.now()}${fileExtension}`;

    const fileData = fs.readFileSync(file.filepath);
    console.log("File read");

    const uploadUrl = `https://${BUNNY_STORAGE_HOST}/${BUNNY_STORAGE_USER}/${uniqueFileName}`;
    console.log(`Uploading to: ${uploadUrl}`);

    const uploadRes = await axios.put(uploadUrl, fileData, {
      headers: {
        AccessKey: BUNNY_STORAGE_PASSWORD,
        "Content-Type": file.mimetype || "application/octet-stream",
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });

    console.log("Upload successful", uploadRes.data);

    // Optional cleanup
    try {
      fs.unlinkSync(file.filepath);
      console.log("Temp file cleaned");
    } catch (e) {
      console.warn("Could not clean temp file:", e);
    }

    const publicUrl = `https://${
      BUNNY_PULL_ZONE_URL || BUNNY_STORAGE_HOST.replace("storage.", "")
    }/${uniqueFileName}`;
    console.log(`Upload complete: ${publicUrl}`);

    return res.status(200).json({
      success: true,
      message: "File uploaded successfully to Bunny CDN",
      fileName: uniqueFileName,
      originalName,
      url: publicUrl,
      size: file.size,
      type: file.mimetype,
      provider: "bunny.net",
    });
  } catch (error: any) {
    console.error("Upload failed:", error.message);
    return res.status(500).json({
      error: "Upload failed",
      message: error.message,
      details: error.response?.data || null,
    });
  }
};

export default uploadHandler;
