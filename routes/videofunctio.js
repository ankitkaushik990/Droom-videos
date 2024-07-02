const express = require("express");
const router = express.Router();
const upload = require("../utils/multerUtils");
const videoController = require("../controller/videoUploaderController");

router.post("/uploads", upload.single("video"), videoController.uploadVideo);

module.exports = router;
