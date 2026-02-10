const config = require("./config");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const s3 = new S3Client({
  region: config.s3.region
});

async function uploadToS3(file) {

  const command = new PutObjectCommand({
    Bucket: config.s3.bucketName,
    Key: file.originalname,
    Body: file.buffer,
    ContentType: file.mimetype
  });

  await s3.send(command);
}

module.exports = uploadToS3;
