const fs = require("fs");
const path = require("path");

const CHUNK_FOLDER = path.join(__dirname, "client_chunks");
const OUTPUT_FOLDER = path.join(__dirname, "merged");

if (!fs.existsSync(OUTPUT_FOLDER)) fs.mkdirSync(OUTPUT_FOLDER);

function mergeChunks(filename) {
  const files = fs.readdirSync(CHUNK_FOLDER);

  const chunkFiles = files
    .filter(f => f.startsWith(filename + "_chunk_"))
    .sort((a, b) => {
      return parseInt(a.split("_chunk_")[1]) - parseInt(b.split("_chunk_")[1]);
    });

  console.log("Before merging:", chunkFiles);

  const outputPath = path.join(OUTPUT_FOLDER, filename);
  const writeStream = fs.createWriteStream(outputPath);

  for (const file of chunkFiles) {
    const data = fs.readFileSync(path.join(CHUNK_FOLDER, file));
    writeStream.write(data);
  }

  writeStream.end();

  writeStream.on("finish", () => {
    console.log("Merged file created:", outputPath);
  });
}

mergeChunks(process.argv[2]);