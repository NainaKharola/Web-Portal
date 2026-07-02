const fs = require("fs");
const path = require("path");
const multer = require("multer");

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const uploadFolders = {
  resume: "resumes",
  result: "results",
  photo: "photos",
};

const allowedTypes = {
  resume: ["application/pdf"],
  result: ["application/pdf", "image/jpeg", "image/jpg"],
  photo: ["image/png", "image/jpeg", "image/jpg"],
};

Object.values(uploadFolders).forEach((folder) => {
  fs.mkdirSync(path.join(__dirname, "..", "uploads", folder), { recursive: true });
});

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, path.join(__dirname, "..", "uploads", uploadFolders[file.fieldname]));
  },
  filename(req, file, cb) {
    const extension = path.extname(file.originalname).toLowerCase();
    const safeBaseName = path
      .basename(file.originalname, extension)
      .replace(/[^a-z0-9]/gi, "-")
      .toLowerCase();
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}-${safeBaseName}${extension}`;

    cb(null, uniqueName);
  },
});

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
]);

function uploadStudentDocuments(req, res, next) {
  upload(req, res, (error) => {
    if (!error) return next();

    if (error instanceof multer.MulterError) {
      const message = error.code === "LIMIT_FILE_SIZE" ? "File size must not exceed 10MB." : error.message;
      return res.status(400).json({ success: false, message });
    }

    return res.status(400).json({ success: false, message: error.message });
  });
}

module.exports = { uploadStudentDocuments };
