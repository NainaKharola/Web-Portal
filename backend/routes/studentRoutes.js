const express = require("express");
const {
  createStudent,
  deleteStudent,
  downloadStudentDocument,
  getStudentDashboard,
  loginStudent,
  uploadCompletedStudentDocuments,
} = require("../controllers/studentController");
const {
  uploadCompletedDocuments,
  uploadStudentDocuments,
} = require("../middleware/uploadMiddleware");

const router = express.Router();

router.post("/", uploadStudentDocuments, createStudent);
router.post("/login", loginStudent);
router.get("/dashboard", getStudentDashboard);
router.get("/documents/:type", downloadStudentDocument);
router.post(
  "/completed-documents",
  uploadCompletedDocuments,
  uploadCompletedStudentDocuments
);
router.delete("/:id", deleteStudent);

module.exports = router;
