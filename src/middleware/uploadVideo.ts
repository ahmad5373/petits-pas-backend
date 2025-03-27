// services/vimeo.ts

import { Vimeo } from "vimeo";

const client = new Vimeo(
  process.env.VIMEO_CLIENT_ID!,
  process.env.VIMEO_CLIENT_SECRET!,
  process.env.VIMEO_ACCESS_TOKEN!
);

export const uploadVideoToVimeo = async (filePath: string, title: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    client.upload(
      filePath,
      { name: title },
      (uri: string) => {
        // Example URI: "/videos/123456789"
        resolve(uri.split('/').pop()!); // Extract video ID
      },
      (bytesUploaded: number, bytesTotal: number) => {
        // Optional: Add progress tracking
        console.log(`Upload Progress: ${(bytesUploaded / bytesTotal) * 100}%`);
      },
      (error: any) => reject(error)
    );
  });
};