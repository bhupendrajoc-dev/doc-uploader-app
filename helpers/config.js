module.exports = {
  db: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  },

  s3: {
    bucketName: process.env.S3_BUCKET,
    region: process.env.AWS_REGION
  }
};
