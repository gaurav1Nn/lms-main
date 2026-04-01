import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from "dotenv";
dotenv.config();

// Export the singleton S3 client
export const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
  requestChecksumCalculation: "WHEN_REQUIRED",
  responseChecksumValidation: "WHEN_REQUIRED",
});

/**
 * Generate a presigned URL allowing the frontend to download/stream a video.
 * @param {string} key The exact S3 object key
 * @returns {Promise<string>} The presigned URL
 */
export const generatePresignedGetUrl = async (key) => {
  const command = new GetObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
  });

  // Calculate expiry from env, fallback to 4 hours
  const expiresIn = parseInt(process.env.PRESIGNED_GET_EXPIRY || "14400", 10);
  
  return await getSignedUrl(s3Client, command, { expiresIn });
};

/**
 * Generate a presigned URL allowing the frontend to upload a video.
 * @param {string} key The exact S3 object key to write to
 * @returns {Promise<string>} The presigned URL
 */
export const generatePresignedPutUrl = async (key) => {
  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
    ContentType: "video/mp4",
  });

  // Calculate expiry from env, fallback to 15 mins
  const expiresIn = parseInt(process.env.PRESIGNED_PUT_EXPIRY || "900", 10);
  
  return await getSignedUrl(s3Client, command, { 
    expiresIn,
    unhoistableHeaders: new Set(["x-amz-checksum-crc32"])
  });
};
