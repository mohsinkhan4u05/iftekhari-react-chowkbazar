import type { NextApiRequest, NextApiResponse } from "next";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { createNextPageApiHandler } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async ({ req, res }) => {
      return { userId: "anonymous-user" };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.url);
      return { uploadedBy: metadata.userId, url: file.url, key: file.key };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

const handler = createNextPageApiHandler({
  router: ourFileRouter,
  config: {
    logLevel: "debug",
  },
});

export default async function uploadthingHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
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
