const multer = require("multer");
const streamifier = require("streamifier");
const cloudinary = require("../config/cloudinary");

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const uploadFolders = {
  resume: "resumes",
  result: "results",
  photo: "photos",
  permissionLetter: "permissionLetters",
};

const allowedTypes = {
  resume: ["application/pdf"],
  result: ["application/pdf", "image/jpeg", "image/jpg"],
  photo: ["image/png", "image/jpeg", "image/jpg"],
  permissionLetter: [
    "application/pdf",
    "image/jpeg",
    "image/jpg",
    "image/png",
  ],
};

// Store files in memory instead of local uploads folder
const storage = multer.memoryStorage();

function fileFilter(req, file, cb) {
  const allowed = allowedTypes[file.fieldname];

  if (!allowed) {
    return cb(new Error("Unexpected file field."));
  }

  if (!allowed.includes(file.mimetype)) {
    return cb(new Error(`${file.fieldname} has an invalid file type.`));
  }

  cb(null, true);
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
}).fields([
  { name: "resume", maxCount: 1 },
  { name: "result", maxCount: 1 },
  { name: "photo", maxCount: 1 },
  { name: "permissionLetter", maxCount: 1 },
]);

async function uploadToCloudinary(file, folder) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: `web-portal/${folder}`,
        resource_type: "auto",
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    streamifier.createReadStream(file.buffer).pipe(stream);
  });
}

function uploadStudentDocuments(req, res, next) {
  upload(req, res, async (error) => {
    if (error) {
      if (error instanceof multer.MulterError) {
        const message =
          error.code === "LIMIT_FILE_SIZE"
            ? "File size must not exceed 10MB."
            : error.message;

        return res.status(400).json({
          success: false,
          message,
        });
      }

      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    try {
      const uploadedFiles = {};

      if (req.files) {
        for (const fieldName of Object.keys(req.files)) {
          const file = req.files[fieldName][0];

          const result = await uploadToCloudinary(
            file,
            uploadFolders[fieldName]
          );

          uploadedFiles[fieldName] = {
            url: result.secure_url,
            public_id: result.public_id,
            originalName: file.originalname,
          };
          console.log("Uploaded:", result.secure_url);
        }
      }

      req.uploadedFiles = uploadedFiles;

      next();
    } 
    catch (err) {
    console.error("========== CLOUDINARY ERROR ==========");
    console.error(err);
    console.error("=====================================");

    return res.status(500).json({
      success: false,
      message: "Cloudinary upload failed.",
      error: err.message,
    });
  }
  });
}

module.exports = { uploadStudentDocuments };