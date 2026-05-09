const fs = require("fs");
const path = require("path");

const USERS_FOLDER = path.join(__dirname, "../users");

const getNodes = (req, res) => {
  try {
    if (!fs.existsSync(USERS_FOLDER)) {
      return res.json([]);
    }

    const users = fs.readdirSync(USERS_FOLDER);

    const nodes = users.map((user) => {
      const userPath = path.join(USERS_FOLDER, user);

      const files = fs.existsSync(userPath)
        ? fs.readdirSync(userPath)
        : [];

      return {
        name: user,
        chunks: files.length,
        online: true,
      };
    });

    res.json(nodes);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { getNodes };