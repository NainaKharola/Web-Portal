const express = require("express");
const College = require("../models/College");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const colleges = await College.find().sort({ name: 1 });

    res.json(colleges);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

module.exports = router;