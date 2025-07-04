/**
 * Utilities for SEO and Open Graph optimization
 */

export interface OpenGraphImage {
  url: string;
  width: number;
  height: number;
  alt: string;
  type?: string;
}

export interface SEOData {
  title: string;
  description: string;
  url: string;
  image: OpenGraphImage;
  siteName: string;
  type: 'website' | 'article';
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    authors?: string[];
    section?: string;
    tags?: string[];
  };
}

/**
 * Ensures image URL is absolute and properly formatted for Open Graph
 */
export function normalizeImageUrl(imageUrl: string, baseUrl = 'https://www.silsilaeiftekhari.in'): string {
  if (!imageUrl) return `${baseUrl}/assets/images/logo.png`;
  
  // If already absolute URL, return as is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
  // If relative URL, make it absolute
  const cleanUrl = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
  return `${baseUrl}${cleanUrl}`;
}

/**
 * Generates optimized Open Graph image object
 */
export function createOpenGraphImage(imageUrl: string, alt: string, width = 1200, height = 630): OpenGraphImage {
  return {
    url: normalizeImageUrl(imageUrl),
    width,
    height,
    alt,
    type: 'image/jpeg'
  };
}

/**
 * Cleans HTML content for meta descriptions
 */
export function cleanHtmlForMeta(html: string, maxLength = 160): string {
  if (!html) return '';
  
  // Remove HTML tags
  const textOnly = html.replace(/<[^>]*>/g, '');
  
  // Decode HTML entities
  const decoded = textOnly
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');
  
  // Trim and limit length
  const trimmed = decoded.trim();
  if (trimmed.length <= maxLength) {
    return trimmed;
  }
  
  // Cut at word boundary
  const cutAt = trimmed.lastIndexOf(' ', maxLength);
  return cutAt > 0 ? `${trimmed.substring(0, cutAt)}...` : `${trimmed.substring(0, maxLength)}...`;
}

/**
 * Generates full SEO data for a blog post
 */
export function generateBlogSEO(blog: any, currentUrl?: string): SEOData {
  const baseUrl = 'https://www.silsilaeiftekhari.in';
  const url = currentUrl || `${baseUrl}/blogs/${blog.slug}`;
  
  // Ensure tags is always an array
  let tags: string[] = [];
  if (blog.tags) {
    if (Array.isArray(blog.tags)) {
      tags = blog.tags;
    } else if (typeof blog.tags === 'string') {
      tags = blog.tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag.length > 0);
    }
  }
  
  // Ensure authors is always an array
  const authors = blog.author ? [blog.author] : [];
  
  return {
    title: `${blog.title} | Iftekhari Silsila`,
    description: cleanHtmlForMeta(blog.summary || blog.content, 160),
    url,
    image: createOpenGraphImage(blog.coverImage, blog.title),
    siteName: 'Iftekhari Silsila',
    type: 'article',
    article: {
      publishedTime: blog.createdAt,
      modifiedTime: blog.updatedAt,
      authors,
      section: blog.category || 'Blog',
      tags
    }
  };
}

/**
 * Validates if an image URL is likely to work for Open Graph
 */
export function validateOpenGraphImage(imageUrl: string): boolean {
  if (!imageUrl) return false;
  
  // Check if it's a valid URL format
  try {
    new URL(normalizeImageUrl(imageUrl));
    return true;
  } catch {
    return false;
  }
}

/**
 * Generates fallback Open Graph image URL
 */
export function getFallbackImage(): string {
  return 'https://www.silsilaeiftekhari.in/assets/images/logo.png';
}

/**
 * Optimizes image URL for specific social platforms
 */
export function optimizeImageForPlatform(imageUrl: string, platform: 'whatsapp' | 'facebook' | 'twitter' = 'whatsapp'): string {
  const normalizedUrl = normalizeImageUrl(imageUrl);
  
  // WhatsApp prefers JPEGs and specific dimensions
  if (platform === 'whatsapp') {
    // If using Next.js Image optimization, add query params
    if (normalizedUrl.includes('silsilaeiftekhari.in')) {
      return `${normalizedUrl}?w=1200&h=630&q=80&f=jpeg`;
    }
  }
  
  return normalizedUrl;
}
