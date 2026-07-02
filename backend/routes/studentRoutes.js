const express = require("express");
const { createStudent } = require("../controllers/studentController");
const { uploadStudentDocuments } = require("../middleware/uploadMiddleware");

const router = express.Router();

router.post("/", uploadStudentDocuments, createStudent);

module.exports = router;
