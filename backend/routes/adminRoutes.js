const express = require("express");
const {
  getAdminProfile,
  loginAdmin,
  registerAdmin,
} = require("../controllers/adminAuthController");
const {
  getStudentById,
  getStudents,
  recommendedByOptions,
  updateStudentReview,
  uploadOfferLetter,
} = require("../controllers/adminStudentController");
const { protectAdmin } = require("../middleware/adminAuth");
const { ensureApprovedStudent } = require("../middleware/ensureApprovedStudent");
const { uploadOfferLetter: uploadOfferLetterFile } = require("../middleware/offerLetterUpload");

const router = express.Router();

router.post("/auth/register", registerAdmin);
router.post("/auth/login", loginAdmin);
router.get("/auth/me", protectAdmin, getAdminProfile);

router.get("/recommended-by-options", protectAdmin, (req, res) => {
  res.status(200).json({
    success: true,
    options: recommendedByOptions,
  });
});

router.get("/students", protectAdmin, getStudents);
router.get("/students/:id", protectAdmin, getStudentById);
router.patch("/students/:id/review", protectAdmin, updateStudentReview);
router.post(
  "/students/:id/offer-letter",
  protectAdmin,
  ensureApprovedStudent,
  uploadOfferLetterFile,
  uploadOfferLetter
);

module.exports = router;
