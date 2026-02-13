import sharp from "sharp";
import path from "path";
import fs from "fs/promises";

const UPLOADS_DIR = path.resolve("uploads");
const MAX_WIDTH = 1200;

// Ensure uploads directory exists
async function ensureUploadsDir() {
  await fs.mkdir(UPLOADS_DIR, { recursive: true });
}

export async function processAndSaveImage(
  buffer: Buffer,
  productId: number,
  filename: string
): Promise<string> {
  await ensureUploadsDir();

  const productDir = path.join(UPLOADS_DIR, String(productId));
  await fs.mkdir(productDir, { recursive: true });

  // Convert filename to .webp
  const baseName = path.parse(filename).name;
  const webpFilename = `${baseName}-${Date.now()}.webp`;
  const outputPath = path.join(productDir, webpFilename);

  await sharp(buffer)
    .resize(MAX_WIDTH, undefined, { withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(outputPath);

  // Return the URL path (relative to the server)
  return `/uploads/${productId}/${webpFilename}`;
}

export async function deleteImage(imageUrl: string): Promise<void> {
  // imageUrl is like /uploads/1/filename.webp
  const filePath = path.join(path.resolve("."), imageUrl);

  try {
    await fs.unlink(filePath);
  } catch (err) {
    console.error(`Failed to delete image file: ${filePath}`, err);
  }
}

export async function deleteProductImages(productId: number): Promise<void> {
  const productDir = path.join(UPLOADS_DIR, String(productId));

  try {
    await fs.rm(productDir, { recursive: true, force: true });
  } catch (err) {
    console.error(`Failed to delete product image directory: ${productDir}`, err);
  }
}
