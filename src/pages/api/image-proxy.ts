// pages/api/image-proxy.ts

import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { url } = req.query;

  if (!url || typeof url !== "string") {
    return res.status(400).send("Missing or invalid URL");
  }

  try {
    const imageResponse = await fetch(`http://${url}`);
    const contentType = imageResponse.headers.get("content-type");

    const buffer = await imageResponse.arrayBuffer();

    res.setHeader("Content-Type", contentType || "image/jpeg");
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    res.send(Buffer.from(buffer));
  } catch (error) {
    res.status(500).send("Failed to fetch image");
  }
}
