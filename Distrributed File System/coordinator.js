const net = require("net");
const fs = require("fs");
const crypto = require("crypto");
const path = require("path");

const COORD_PORT = 6000;
const CHUNK_SIZE = 4 * 1024;
const METADATA_FILE = path.join(__dirname, "metadata.json");
const CHUNK_FOLDER = path.join(__dirname, "chunks");

let metadata = {};

if (!fs.existsSync(CHUNK_FOLDER)) fs.mkdirSync(CHUNK_FOLDER);

if (fs.existsSync(METADATA_FILE)) {
  metadata = JSON.parse(fs.readFileSync(METADATA_FILE, "utf8"));
  console.log("Coordinator loaded", Object.keys(metadata).length, "files");
}

function saveMetadata() {
  fs.writeFileSync(METADATA_FILE, JSON.stringify(metadata, null, 2));
}

function chunkFile(filePath) {
  const data = fs.readFileSync(filePath);
  const chunks = [];

  let offset = 0;
  let chunkId = 0;

  while (offset < data.length) {
    const slice = data.slice(offset, offset + CHUNK_SIZE);

    const hash = crypto.createHash("sha256")
      .update(slice)
      .digest("hex");

    chunks.push({
      chunkId,
      data: slice,
      hash
    });

    offset += CHUNK_SIZE;
    chunkId++;
  }

  return chunks;
}

function handleRequest(socket) {
  let dataArr = [];

  socket.on("data", (d) => dataArr.push(d));

  socket.on("end", () => {
    let request;

    try {
      request = JSON.parse(Buffer.concat(dataArr).toString());
    } catch {
      socket.write(JSON.stringify({ error: "Invalid JSON" }));
      socket.end();
      return;
    }

    if (request.action === "register") {
      if (!metadata[request.filename]) metadata[request.filename] = [];

      metadata[request.filename].push({
        chunkId: request.chunkId,
        nodeHost: request.nodeHost,
        nodePort: request.nodePort,
        hash: request.hash
      });

      saveMetadata();

      console.log("Chunk", request.chunkId, "registered");

      socket.write(JSON.stringify({ ok: true }));
    }

    socket.end();
  });
}


// 🔥 ONLY RUN SERVER IF NOT UPLOAD
if (process.argv[2] !== "upload") {
  const server = net.createServer(handleRequest);

  server.listen(COORD_PORT, () => {
    console.log("Coordinator running on port", COORD_PORT);
  });
}


// 🔥 UPLOAD MODE
if (process.argv[2] === "upload") {

  const filePath = process.argv[3];

  if (!fs.existsSync(filePath)) {
    console.log("File not found");
    process.exit(1);
  }

  const filename = path.basename(filePath);

  const fileChunks = chunkFile(filePath);

  console.log("File divided into", fileChunks.length, "chunks");
  console.log("Each chunk size: 4KB");

  let registered = 0;

  for (const chunk of fileChunks) {

    // ✅ BEFORE MERGING → STORE CHUNKS
    const chunkPath = path.join(
      CHUNK_FOLDER,
      filename + "_chunk_" + chunk.chunkId
    );

    fs.writeFileSync(chunkPath, chunk.data);

    console.log("Stored:", filename + "_chunk_" + chunk.chunkId);

    // register metadata
    const payload = JSON.stringify({
      action: "register",
      filename,
      chunkId: chunk.chunkId,
      nodeHost: "127.0.0.1",
      nodePort: 5000,
      hash: chunk.hash
    });

    const s = net.createConnection(
      { host: "127.0.0.1", port: COORD_PORT },
      () => {
        s.write(payload);
        s.end();
      }
    );

    s.on("data", () => {
      registered++;

      if (registered === fileChunks.length) {
        console.log("All chunks registered");
      }
    });
  }
}