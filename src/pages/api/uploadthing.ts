import type { NextApiRequest, NextApiResponse } from "next";
import { createUploadthing, type FileRouter } from "uploadthing/next-legacy";
import { createNextPageApiHandler } from "uploadthing/next-legacy";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req, res }) => {
      // This code runs on your server before upload
      console.log("UploadThing middleware called");
      
      // You can add authentication checks here
      // For now, we'll allow all uploads
      
      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: "anonymous-user" };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.url);
      console.log("file key", file.key);
      console.log("file name", file.name);

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata.userId, url: file.url, key: file.key };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

// Create the handler
const handler = createNextPageApiHandler({
  router: ourFileRouter,
  config: {
    logLevel: "debug", // Enable debug logging
  },
});

// Add error handling wrapper
export default async function uploadthingHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("UploadThing API called:", {
    method: req.method,
    url: req.url,
    headers: req.headers,
  });

  try {
    return await handler(req, res);
  } catch (error) {
    console.error("UploadThing handler error:", error);
    return res.status(500).json({
      error: "Upload failed",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
