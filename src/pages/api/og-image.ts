// /pages/api/og-image.ts

import type { NextApiRequest, NextApiResponse } from "next";
import https from "https";
import http from "http";
import { URL } from "url";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const imageUrl = req.query.url as string;

  if (!imageUrl || !/^https:\/\/utfs\.io\/f\//.test(imageUrl)) {
    return res.status(400).json({ error: "Invalid or missing image URL" });
  }

  try {
    const url = new URL(imageUrl);
    const client = url.protocol === "https:" ? https : http;

    client
      .get(url, (proxyRes) => {
        const contentType = proxyRes.headers["content-type"] || "image/jpeg";
        res.setHeader("Content-Type", contentType);
        res.setHeader("Cache-Control", "public, max-age=86400");
        proxyRes.pipe(res);
      })
      .on("error", (err) => {
        console.error("Image proxy error:", err);
        res.status(500).json({ error: "Failed to fetch image" });
      });
  } catch (err) {
    res.status(500).json({ error: "Invalid proxy request" });
  }
}
