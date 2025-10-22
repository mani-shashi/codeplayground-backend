import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';

dotenv.config();

// Initialize S3 client
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

/**
 * Upload a file to S3
 */
export const uploadToS3 = async (buffer, key, mimetype) => {
  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: key,
    Body: buffer,
    ContentType: mimetype,
  });

  await s3.send(command);

  const s3Url = `https://${process.env.S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
  return { Location: s3Url };
};

/**
 * Delete a file from S3
 */
export const deleteFromS3 = async (key) => {
  const command = new DeleteObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: key,
  });

  await s3.send(command);
};
