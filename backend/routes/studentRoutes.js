const express = require("express");
const {
  createStudent,
  deleteStudent,
} = require("../controllers/studentController");
const { uploadStudentDocuments } = require("../middleware/uploadMiddleware");

const router = express.Router();

router.post("/", uploadStudentDocuments, createStudent);
router.delete("/:id", deleteStudent);

module.exports = router;
