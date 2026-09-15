const express = require("express");
const { adminAction } = require("../controllers/adminController");

const router = express.Router();

router.post("/", adminAction);

module.exports = router;