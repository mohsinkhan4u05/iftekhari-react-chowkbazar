// Export only types for now to avoid hook issues
import type { OurFileRouter } from "../pages/api/uploadthing";

// Type exports for use in other components
export type { OurFileRouter };

// Note: UploadButton and UploadDropzone components removed due to hook compatibility issues
// Using custom implementation in CoverImageUploader instead
