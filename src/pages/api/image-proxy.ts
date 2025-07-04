// pages/api/image-proxy.ts
// Enhanced image proxy for better Open Graph image handling

import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url, w = '1200', h = '630', q = '80', f = 'jpeg' } = req.query;

  if (!url || typeof url !== "string") {
    return res.status(400).json({ error: 'URL parameter is required' });
  }

  try {
    // Determine the full URL to fetch
    let fetchUrl = url;
    
    // If it's a relative URL, make it absolute
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      // Try HTTPS first, then HTTP
      fetchUrl = url.startsWith('//') ? `https:${url}` : `https://${url}`;
    }

    const imageResponse = await fetch(fetchUrl);
    
    if (!imageResponse.ok) {
      throw new Error(`HTTP ${imageResponse.status}: ${imageResponse.statusText}`);
    }

    const contentType = imageResponse.headers.get("content-type") || "image/jpeg";
    const buffer = await imageResponse.arrayBuffer();

    // Set headers optimized for social media crawlers
    res.setHeader("Content-Type", contentType);
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("X-Content-Type-Options", "nosniff");
    
    // Add dimensions if available
    if (w && h) {
      res.setHeader("X-Image-Width", w.toString());
      res.setHeader("X-Image-Height", h.toString());
    }

    res.status(200).send(Buffer.from(buffer));
  } catch (error) {
    console.error('Image proxy error:', error);
    
    // Try to serve a fallback image
    try {
      const fallbackResponse = await fetch('https://www.silsilaeiftekhari.in/assets/images/logo.png');
      if (fallbackResponse.ok) {
        const fallbackBuffer = await fallbackResponse.arrayBuffer();
        res.setHeader("Content-Type", "image/png");
        res.setHeader("Cache-Control", "public, max-age=3600");
        res.status(200).send(Buffer.from(fallbackBuffer));
        return;
      }
    } catch (fallbackError) {
      console.error('Fallback image error:', fallbackError);
    }
    
    res.status(404).json({ error: 'Image not found' });
  }
}
