const streamifier = require("streamifier");
const cloudinary = require("../config/cloudinary");

function uploadBufferToCloudinary(buffer, options = {}) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "web-portal/offerLetters",
        resource_type: "raw",
        format: "pdf",
        ...options,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
}

module.exports = { uploadBufferToCloudinary };
