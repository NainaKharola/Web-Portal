const mongoose = require("mongoose");

function isMongoAvailable() {
  return mongoose.connection.readyState === 1;
}

function isCloudinaryConfigured() {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET,
  );
}

module.exports = { isCloudinaryConfigured, isMongoAvailable };
