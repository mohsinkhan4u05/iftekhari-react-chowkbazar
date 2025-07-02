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

  const uploadDir = path.join(process.cwd(), "public/uploads");
  fs.mkdirSync(uploadDir, { recursive: true });

  const form = formidable({
    uploadDir,
    keepExtensions: true,
  });

  form.parse(req, (err, fields, files) => {
    if (err) {
      console.error("Formidable Error:", err);
      return res.status(500).json({ message: "Error parsing file upload" });
    }

    const file = files.file?.[0];
    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const fileName = path.basename(file.filepath);
    const url = `/uploads/${fileName}`;

    return res.status(200).json({ url });
  });
}
