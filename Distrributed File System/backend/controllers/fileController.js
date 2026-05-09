const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const SHARED_FOLDER = path.join(__dirname, "../shared");
const MERGED_FOLDER = path.join(__dirname, "../merged");
const METADATA_FILE = path.join(__dirname, "../metadata.json");

const uploadFile = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const filePath = req.file.path;

    exec(
      `node coordinator.js upload "${filePath}"`,
      { cwd: path.join(__dirname, "..") },
      (error, stdout, stderr) => {
        if (error) {
          return res.status(500).json({
            success: false,
            message: stderr || error.message,
          });
        }

        res.json({
          success: true,
          message: "File uploaded successfully",
          output: stdout,
        });
      }
    );
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getFiles = (req, res) => {
  try {
    if (!fs.existsSync(METADATA_FILE)) {
      return res.json([]);
    }

    const metadata = JSON.parse(
      fs.readFileSync(METADATA_FILE, "utf8")
    );

    const files = Object.keys(metadata).map((file) => ({
      filename: file,
      chunks: metadata[file].length,
    }));

    res.json(files);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const mergeFileController = (req, res) => {
  try {
    const filename = req.params.filename;

    exec(
      `node merge.js "${filename}"`,
      { cwd: path.join(__dirname, "..") },
      (error, stdout, stderr) => {
        if (error) {
          return res.status(500).json({
            success: false,
            message: stderr || error.message,
          });
        }

        res.json({
          success: true,
          message: "File merged successfully",
          output: stdout,
        });
      }
    );
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const downloadFile = (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(MERGED_FOLDER, filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    res.download(filePath);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  uploadFile,
  getFiles,
  mergeFileController,
  downloadFile,
};