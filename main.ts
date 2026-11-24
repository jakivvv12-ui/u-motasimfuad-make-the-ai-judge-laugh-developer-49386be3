const fs = require("fs");
const path = require("path");

const ENTRY =
  "It works on my machine because my machine still has the .env file I forgot to commit, to document, or to tell anyone about.";

function validate(text, label) {
  const len = Array.from(text).length;
  if (len < 1 || len > 200) {
    throw new Error(label + " length out of range: " + len + " code points");
  }
  if (text.trim().length === 0) {
    throw new Error(label + " is whitespace-only");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error(label + " contains a newline");
  }
  if (text !== text.trimEnd()) {
    throw new Error(label + " has trailing whitespace");
  }
  return len;
}

function main() {
  const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
  const outFile = path.join(outDir, "entry.txt");

  const len = validate(ENTRY, "entry");

  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(outFile, ENTRY, "utf8");

  const back = fs.readFileSync(outFile, "utf8");
  validate(back, "round-trip file");
  if (back !== ENTRY) {
    throw new Error("round-trip mismatch: file content differs from entry");
  }

  console.log("wrote " + outFile + " (" + len + " code points)");
}

main();
