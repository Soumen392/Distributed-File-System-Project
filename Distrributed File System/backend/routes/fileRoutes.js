const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");

const {
  uploadFile,
  getFiles,
  mergeFileController,
  downloadFile,
} = require("../controllers/fileController");

router.post("/upload", upload.single("file"), uploadFile);

router.get("/files", getFiles);

router.post("/merge/:filename", mergeFileController);

router.get("/download/:filename", downloadFile);

module.exports = router;