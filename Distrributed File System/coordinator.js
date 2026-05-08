const net = require("net");
const fs = require("fs");
const crypto = require("crypto");
const path = require("path");

const COORD_PORT = 6000;
const CHUNK_SIZE = 4 * 1024;
const METADATA_FILE = path.join(__dirname, "metadata.json");
const USERS_FOLDER = path.join(__dirname, "users");

const USERS = ["user1", "user2", "user3", "user4", "user5"];

if (!fs.existsSync(USERS_FOLDER)) {
  fs.mkdirSync(USERS_FOLDER);
}

for (const user of USERS) {
  const userPath = path.join(USERS_FOLDER, user);
  if (!fs.existsSync(userPath)) {
    fs.mkdirSync(userPath, { recursive: true });
  }
}

let metadata = {};

if (fs.existsSync(METADATA_FILE)) {
  metadata = JSON.parse(fs.readFileSync(METADATA_FILE, "utf8"));
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

    const hash = crypto
      .createHash("sha256")
      .update(slice)
      .digest("hex");

    chunks.push({
      chunkId,
      data: slice,
      hash,
      size: slice.length,
    });

    offset += CHUNK_SIZE;
    chunkId++;
  }

  return chunks;
}

function handleRequest(socket) {
  socket.on("data", () => {});
  socket.on("end", () => {
    socket.end();
  });
}

if (process.argv[2] !== "upload") {
  const coordinator = net.createServer(handleRequest);

  coordinator.listen(COORD_PORT, () => {
    console.log("Coordinator running on port", COORD_PORT);
  });
}

if (process.argv[2] === "upload") {
  const filePath = process.argv[3];

  if (!fs.existsSync(filePath)) {
    console.log("File not found");
    process.exit(1);
  }

  const filename = path.basename(filePath);
  const fileChunks = chunkFile(filePath);

  metadata[filename] = [];

  console.log("File:", filename);
  console.log("Total chunks:", fileChunks.length);
  console.log("Each chunk size: 4KB");

  for (const chunk of fileChunks) {
    const first = USERS[chunk.chunkId % USERS.length];
    const second = USERS[(chunk.chunkId + 1) % USERS.length];

    const replicaUsers = [first, second];

    for (const user of replicaUsers) {
      const chunkPath = path.join(
        USERS_FOLDER,
        user,
        `${filename}_chunk_${chunk.chunkId}`
      );

      fs.writeFileSync(chunkPath, chunk.data);
    }

    metadata[filename].push({
      chunkId: chunk.chunkId,
      hash: chunk.hash,
      users: replicaUsers,
    });

    console.log(
      "Chunk",
      chunk.chunkId,
      "stored in",
      first,
      "and",
      second
    );
  }

  saveMetadata();
  console.log("All chunks distributed successfully");
}