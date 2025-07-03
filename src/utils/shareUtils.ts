// Share utility for handling various share methods across different browsers and contexts

interface ShareData {
  title?: string;
  text?: string;
  url?: string;
}

interface ShareOptions {
  showSuccessMessage?: boolean;
  successMessage?: string;
  fallbackMessage?: string;
  showSocialOptions?: boolean;
}

export class ShareUtils {
  /**
   * Check if Web Share API is supported and available
   */
  static isWebShareSupported(): boolean {
    return (
      typeof navigator !== 'undefined' &&
      'share' in navigator &&
      typeof navigator.share === 'function'
    );
  }

  /**
   * Check if we're in a secure context (HTTPS or localhost)
   */
  static isSecureContext(): boolean {
    return (
      typeof window !== 'undefined' &&
      (window.location.protocol === 'https:' || 
       window.location.hostname === 'localhost' ||
       window.location.hostname === '127.0.0.1')
    );
  }

  /**
   * Check if Clipboard API is supported
   */
  static isClipboardSupported(): boolean {
    return (
      typeof navigator !== 'undefined' &&
      'clipboard' in navigator &&
      typeof navigator.clipboard?.writeText === 'function'
    );
  }

  /**
   * Fallback method to copy text to clipboard using legacy method
   */
  static async copyToClipboardFallback(text: string): Promise<boolean> {
    try {
      // Create a temporary textarea element
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      
      // Select and copy
      textarea.select();
      document.execCommand('copy');
      
      // Clean up
      document.body.removeChild(textarea);
      return true;
    } catch (error) {
      console.error('Fallback clipboard copy failed:', error);
      return false;
    }
  }

  /**
   * Share content using the best available method
   */
  static async share(
    data: ShareData,
    options: ShareOptions = {}
  ): Promise<{ success: boolean; method: string; error?: string }> {
    const {
      showSuccessMessage = true,
      successMessage = 'Link copied to clipboard!',
      fallbackMessage = 'Unable to share. Please copy the URL manually.',
      showSocialOptions = false
    } = options;

    console.log('=== Share Debug Info ===');
    console.log('Share data:', data);
    console.log('Web Share API supported:', this.isWebShareSupported());
    console.log('Secure context:', this.isSecureContext());
    console.log('Clipboard API supported:', this.isClipboardSupported());
    console.log('Current URL:', window.location.href);
    console.log('Protocol:', window.location.protocol);
    console.log('========================');

    // Method 1: Try Web Share API (if supported and in secure context)
    if (this.isWebShareSupported() && this.isSecureContext()) {
      try {
        console.log('Attempting Web Share API...');
        await navigator.share(data);
        console.log('Web Share API successful');
        return { success: true, method: 'web-share' };
      } catch (error: any) {
        console.error('Web Share API failed:', error);
        // If user cancelled, don't show error
        if (error.name === 'AbortError') {
          return { success: false, method: 'web-share', error: 'User cancelled' };
        }
        // Continue to fallback methods
      }
    }

    // Method 2: Try Clipboard API
    if (this.isClipboardSupported() && data.url) {
      try {
        console.log('Attempting Clipboard API...');
        await navigator.clipboard.writeText(data.url);
        console.log('Clipboard API successful');
        if (showSuccessMessage) {
          alert(successMessage);
        }
        return { success: true, method: 'clipboard' };
      } catch (error) {
        console.error('Clipboard API failed:', error);
        // Continue to fallback
      }
    }

    // Method 3: Try legacy clipboard method
    if (data.url) {
      console.log('Attempting legacy clipboard method...');
      const success = await this.copyToClipboardFallback(data.url);
      if (success) {
        console.log('Legacy clipboard method successful');
        if (showSuccessMessage) {
          alert(successMessage);
        }
        return { success: true, method: 'legacy-clipboard' };
      }
    }

    // Method 4: Final fallback - show URL in prompt
    console.log('All methods failed, showing URL in prompt');
    if (data.url) {
      const userCopied = confirm(
        `${fallbackMessage}\n\nURL: ${data.url}\n\nClick OK to select the URL for manual copying.`
      );
      if (userCopied) {
        // Try to select the URL text (this might not work in all browsers)
        try {
          const selection = window.getSelection();
          const range = document.createRange();
          const span = document.createElement('span');
          span.textContent = data.url;
          document.body.appendChild(span);
          range.selectNode(span);
          selection?.removeAllRanges();
          selection?.addRange(range);
          document.body.removeChild(span);
        } catch (e) {
          console.log('Could not select URL text');
        }
      }
      return { success: false, method: 'manual', error: 'Manual copy required' };
    }

    return { success: false, method: 'none', error: 'No sharing method available' };
  }

  /**
   * Create share data object with sensible defaults
   */
  static createShareData(
    title: string,
    summary?: string,
    url?: string
  ): ShareData {
    return {
      title,
      text: summary || '',
      url: url || (typeof window !== 'undefined' ? window.location.href : '')
    };
  }
}

// Export a simple share function for easy use
export const shareContent = async (
  title: string,
  summary?: string,
  url?: string,
  options?: ShareOptions
) => {
  const shareData = ShareUtils.createShareData(title, summary, url);
  return ShareUtils.share(shareData, options);
};

export default ShareUtils;
