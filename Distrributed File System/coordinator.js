const net = require("net");
const fs = require("fs");
const crypto = require("crypto");
const path = require("path");

const COORD_PORT = 6000;
const CHUNK_SIZE = 256 * 1024;
const METADATA_FILE = path.join(__dirname, "metadata.json");

let metadata = {};

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
    const hash = crypto.createHash("sha256").update(slice).digest("hex");
    chunks.push({ chunkId, data: slice, hash, size: slice.length });
    offset += CHUNK_SIZE;
    chunkId++;
  }

  return chunks;
}

function handleRequest(socket) {
  let chunks = [];
  socket.on("data", (d) => chunks.push(d));

  socket.on("end", () => {
    let request;

    try {
      request = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    } catch {
      socket.write(JSON.stringify({ error: "Invalid JSON format" }));
      socket.end();
      return;
    }

    const { action, filename } = request;

    if (action === "register") {
      const { chunkId, nodeHost, nodePort, hash } = request;

      if (!metadata[filename]) metadata[filename] = [];

      metadata[filename].push({
        chunkId,
        nodeHost,
        nodePort,
        hash,
      });

      saveMetadata();

      console.log(
        "Chunk",
        chunkId,
        "of file",
        filename,
        "registered at",
        nodeHost + ":" + nodePort
      );

      socket.write(JSON.stringify({ ok: true }));
    }

    else if (action === "locate") {
      const fileChunks = metadata[filename];

      if (!fileChunks || fileChunks.length === 0) {
        socket.write(JSON.stringify({ error: "File not found" }));
      } else {
        console.log("Locating file", filename);

        socket.write(
          JSON.stringify({
            filename,
            chunks: fileChunks,
          })
        );
      }
    }

    else if (action === "list") {
      const files = Object.keys(metadata).map((f) => ({
        filename: f,
        chunks: metadata[f].length,
      }));

      socket.write(JSON.stringify({ files }));
    }

    else {
      socket.write(JSON.stringify({ error: "Unknown action" }));
    }

    socket.end();
  });
}

const coordinator = net.createServer(handleRequest);

coordinator.listen(COORD_PORT, () => {
  console.log("Coordinator running on port", COORD_PORT);
});

if (process.argv[2] === "upload") {
  const filePath = process.argv[3];
  const peerHost = process.argv[4] || "127.0.0.1";
  const peerPort = parseInt(process.argv[5] || "5000");

  if (!fs.existsSync(filePath)) {
    console.error("File not found:", filePath);
    process.exit(1);
  }

  const filename = path.basename(filePath);
  const fileChunks = chunkFile(filePath);

  console.log("File", filename, "divided into", fileChunks.length, "chunks");

  let registered = 0;

  for (const chunk of fileChunks) {
    const payload = JSON.stringify({
      action: "register",
      filename,
      chunkId: chunk.chunkId,
      nodeHost: peerHost,
      nodePort: peerPort,
      hash: chunk.hash,
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
        console.log("All", registered, "chunks registered");
      }
    });
  }
}