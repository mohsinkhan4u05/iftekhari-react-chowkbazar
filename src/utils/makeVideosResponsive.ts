/**
 * Utility function to make embedded videos responsive
 * Wraps iframes in responsive containers and adds proper styling
 */
export const makeVideosResponsive = (htmlContent: string): string => {
  if (!htmlContent) return htmlContent;

  // YouTube, Vimeo, and other video iframe patterns
  const videoPatterns = [
    /(<iframe[^>]*src="[^"]*(?:youtube\.com|youtu\.be)[^"]*"[^>]*>)/gi,
    /(<iframe[^>]*src="[^"]*vimeo\.com[^"]*"[^>]*>)/gi,
    /(<iframe[^>]*src="[^"]*dailymotion\.com[^"]*"[^>]*>)/gi,
    /(<iframe[^>]*src="[^"]*facebook\.com[^"]*"[^>]*>)/gi,
    /(<iframe[^>]*src="[^"]*tiktok\.com[^"]*"[^>]*>)/gi,
  ];

  let processedContent = htmlContent;

  // Process each video pattern
  videoPatterns.forEach(pattern => {
    processedContent = processedContent.replace(pattern, (match) => {
      // Check if already wrapped
      if (processedContent.includes(`<div class="video-wrapper">${match}`)) {
        return match;
      }

      // Add responsive wrapper
      return `<div class="video-wrapper">${match}</div>`;
    });
  });

  // Also handle video tags
  processedContent = processedContent.replace(
    /(<video[^>]*>.*?<\/video>)/gi,
    '<div class="video-wrapper">$1</div>'
  );

  // Handle embed tags
  processedContent = processedContent.replace(
    /(<embed[^>]*>)/gi,
    '<div class="video-wrapper">$1</div>'
  );

  return processedContent;
};

/**
 * Process images to be responsive
 */
export const makeImagesResponsive = (htmlContent: string): string => {
  if (!htmlContent) return htmlContent;

  // Add responsive classes to images
  return htmlContent.replace(
    /<img([^>]*)>/gi,
    '<img$1 style="max-width: 100%; height: auto; border-radius: 0.5rem;">'
  );
};

/**
 * Process tables to be responsive
 */
export const makeTablesResponsive = (htmlContent: string): string => {
  if (!htmlContent) return htmlContent;

  return htmlContent.replace(
    /<table([^>]*)>/gi,
    '<div style="overflow-x: auto; margin: 1.5rem 0;"><table$1 style="min-width: 100%; border-radius: 0.5rem;">'
  ).replace(
    /<\/table>/gi,
    '</table></div>'
  );
};

/**
 * Main function to process all content for mobile responsiveness
 */
export const makeContentResponsive = (htmlContent: string): string => {
  if (!htmlContent) return htmlContent;

  let processedContent = htmlContent;
  
  // Process videos first
  processedContent = makeVideosResponsive(processedContent);
  
  // Process images
  processedContent = makeImagesResponsive(processedContent);
  
  // Process tables
  processedContent = makeTablesResponsive(processedContent);
  
  return processedContent;
};

export default makeContentResponsive;
