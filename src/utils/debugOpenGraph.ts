/**
 * Debug utilities for Open Graph meta tags
 * Use these functions to test if your Open Graph setup is working correctly
 */

export interface OpenGraphDebugInfo {
  url: string;
  title?: string;
  description?: string;
  image?: string;
  imageWidth?: number;
  imageHeight?: number;
  type?: string;
  siteName?: string;
}

/**
 * Extracts Open Graph meta tags from the current page
 */
export function extractOpenGraphTags(): OpenGraphDebugInfo {
  if (typeof window === 'undefined') {
    return { url: '' };
  }

  const metaTags = document.querySelectorAll('meta[property^="og:"], meta[name^="og:"]');
  const result: OpenGraphDebugInfo = {
    url: window.location.href
  };

  metaTags.forEach(tag => {
    const property = tag.getAttribute('property') || tag.getAttribute('name') || '';
    const content = tag.getAttribute('content') || '';

    switch (property) {
      case 'og:title':
        result.title = content;
        break;
      case 'og:description':
        result.description = content;
        break;
      case 'og:image':
        result.image = content;
        break;
      case 'og:image:width':
        result.imageWidth = parseInt(content);
        break;
      case 'og:image:height':
        result.imageHeight = parseInt(content);
        break;
      case 'og:type':
        result.type = content;
        break;
      case 'og:site_name':
        result.siteName = content;
        break;
    }
  });

  return result;
}

/**
 * Validates if Open Graph image is accessible
 */
export async function validateOpenGraphImage(imageUrl: string): Promise<boolean> {
  if (!imageUrl) return false;

  try {
    const response = await fetch(imageUrl, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Logs Open Graph debug information to console
 */
export function debugOpenGraph(): void {
  if (typeof window === 'undefined') {
    console.log('Open Graph debugging is only available in the browser');
    return;
  }

  const ogData = extractOpenGraphTags();
  
  console.group('🔍 Open Graph Debug Information');
  console.log('URL:', ogData.url);
  console.log('Title:', ogData.title || 'Not set');
  console.log('Description:', ogData.description || 'Not set');
  console.log('Image:', ogData.image || 'Not set');
  console.log('Image Dimensions:', ogData.imageWidth && ogData.imageHeight ? `${ogData.imageWidth}x${ogData.imageHeight}` : 'Not set');
  console.log('Type:', ogData.type || 'Not set');
  console.log('Site Name:', ogData.siteName || 'Not set');
  
  // Check if image is accessible
  if (ogData.image) {
    validateOpenGraphImage(ogData.image).then(isValid => {
      console.log('Image Accessible:', isValid ? '✅ Yes' : '❌ No');
    });
  }
  
  console.groupEnd();
}

/**
 * Generates WhatsApp sharing URL for testing
 */
export function generateWhatsAppShareUrl(text?: string, url?: string): string {
  const currentUrl = typeof window !== 'undefined' ? window.location.href : url || '';
  const shareText = text || `Check out this article: ${currentUrl}`;
  
  return `https://wa.me/?text=${encodeURIComponent(shareText)}`;
}

/**
 * Tests WhatsApp sharing by opening in new window
 */
export function testWhatsAppShare(text?: string): void {
  if (typeof window === 'undefined') {
    console.log('WhatsApp sharing test is only available in the browser');
    return;
  }

  const shareUrl = generateWhatsAppShareUrl(text);
  window.open(shareUrl, '_blank', 'width=600,height=400');
}

/**
 * Gets Facebook debugger URL for the current page
 */
export function getFacebookDebuggerUrl(url?: string): string {
  const pageUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  return `https://developers.facebook.com/tools/debug/?q=${encodeURIComponent(pageUrl)}`;
}

/**
 * Opens Facebook debugger for the current page
 */
export function openFacebookDebugger(url?: string): void {
  if (typeof window === 'undefined') {
    console.log('Facebook debugger is only available in the browser');
    return;
  }

  const debugUrl = getFacebookDebuggerUrl(url);
  window.open(debugUrl, '_blank');
}
