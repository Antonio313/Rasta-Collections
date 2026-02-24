import sharp from "sharp";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import path from "path";

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET = process.env.AWS_BUCKET_NAME!;
const MAX_WIDTH = 1200;

export async function processAndSaveImage(
  buffer: Buffer,
  productId: number,
  filename: string
): Promise<string> {
  const baseName = path.parse(filename).name;
  const key = `products/${baseName}-${Date.now()}.webp`;

  const webpBuffer = await sharp(buffer)
    .resize(MAX_WIDTH, undefined, { withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer();

  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: webpBuffer,
      ContentType: "image/webp",
    })
  );

  return `https://${BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
}

export async function deleteImage(imageUrl: string): Promise<void> {
  try {
    const url = new URL(imageUrl);
    const key = url.pathname.slice(1); // strip leading /

    await s3.send(
      new DeleteObjectCommand({
        Bucket: BUCKET,
        Key: key,
      })
    );
  } catch (err) {
    console.error(`Failed to delete S3 object: ${imageUrl}`, err);
  }
}

export async function deleteProductImages(productId: number): Promise<void> {
  // Individual images are deleted via deleteImage when removed through the UI.
  // Kept for interface compatibility.
  console.log(`deleteProductImages called for product ${productId}`);
}
