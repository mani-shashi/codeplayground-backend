import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';

dotenv.config();

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

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

export const deleteFromS3 = async (key) => {
  const command = new DeleteObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: key,
  });

  await s3.send(command);
};

// --- ✅ TESTING  ---

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const testKey = 'test/test-file.txt';
const testBuffer = Buffer.from('Hello from S3 Test!', 'utf-8');
const testMime = 'text/plain';

const runS3Test = async () => {
  try {
    console.log('🚀 Uploading test file to S3...');
    const data = await uploadToS3(testBuffer, testKey, testMime);
    console.log('✅ S3 Upload successful!');
    console.log('📎 File URL:', data.Location);

    console.log('⏳ Sleeping for 20 seconds...');
    await sleep(20000);
    console.log('✅ Done sleeping');

    console.log('🗑️ Deleting test file from S3...');
    await deleteFromS3(testKey);
    console.log('✅ Test file deleted!');
  } catch (err) {
    console.error('❌ S3 test failed:', err.message);
  }
};

runS3Test();
