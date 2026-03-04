const net = require("net");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const SERVER_HOST = "127.0.0.1";
const SERVER_PORT = 5000;
const DOWNLOAD_FOLDER = path.join(__dirname, "downloads");

const AES_KEY = crypto.scryptSync("password", "salt", 32);
const AES_IV = Buffer.alloc(16, 0);

if (!fs.existsSync(DOWNLOAD_FOLDER)) fs.mkdirSync(DOWNLOAD_FOLDER);

function decryptBuffer(buf) {
  const decipher = crypto.createDecipheriv("aes-256-cbc", AES_KEY, AES_IV);
  return Buffer.concat([decipher.update(buf), decipher.final()]);
}

function requestFile(filename) {
  console.log("Connecting to server:", SERVER_HOST + ":" + SERVER_PORT);

  const socket = net.createConnection(
    { host: SERVER_HOST, port: SERVER_PORT },
    () => {
      console.log("Connected to server. Requesting file:", filename);

      const nameBuf = Buffer.from(filename, "utf8");
      const header = Buffer.alloc(4);
      header.writeUInt32BE(nameBuf.length);

      socket.write(Buffer.concat([header, nameBuf]));
      socket.end();
    }
  );

  let chunks = [];

  socket.on("data", (data) => chunks.push(data));

  socket.on("end", () => {
    const raw = Buffer.concat(chunks);

    if (raw.toString() === "FILE_NOT_FOUND") {
      console.log("File not found on the server:", filename);
      return;
    }

    const expectedSize = Number(raw.readBigUInt64BE(0));
    const encryptedData = raw.slice(8);

    if (encryptedData.length !== expectedSize) {
      console.warn("Warning: File size mismatch");
    }

    const fileData = decryptBuffer(encryptedData);

    const outPath = path.join(DOWNLOAD_FOLDER, filename);
    fs.writeFileSync(outPath, fileData);

    console.log("File received and saved to:", outPath);
    console.log("File size:", fileData.length, "bytes");
  });

  socket.on("error", (err) => {
    console.error("Connection error:", err.message);
  });
}

const filename = process.argv[2];

if (!filename) {
  console.error("Usage: node client.js <filename>");
  console.error("Example: node client.js test.txt");
  process.exit(1);
}

requestFile(filename);