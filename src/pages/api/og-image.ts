import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { title, image, type = 'article' } = req.query;

  // Set CORS headers for open graph crawlers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');

  if (!title || !image) {
    return res.status(400).json({ error: 'Title and image are required' });
  }

  // Return meta tags as JSON for dynamic generation
  const metaTags = {
    title: title as string,
    description: type === 'article' ? `Read ${title} on Iftekhari Silsila` : title as string,
    image: {
      url: (image as string).startsWith('http') ? image : `https://www.silsilaeiftekhari.in${image}`,
      width: 1200,
      height: 630,
      alt: title as string,
      type: 'image/jpeg'
    },
    url: req.headers.referer || 'https://www.silsilaeiftekhari.in',
    siteName: 'Iftekhari Silsila',
    type: type as string
  };

  res.status(200).json(metaTags);
}
