import path, { dirname } from "path";
import VFile from "./VFile.js";
import { getStaticPaths } from "./FileWalker.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const specFile = path.join(__dirname, "FileWalker.spec.js");

console.log(`Current dir : ${__dirname}`);
console.log(`File : ${specFile}`);

// Filter spec files inside this dir
const specFiles = getStaticPaths(__dirname, ["spec.js"]);
console.log(`Here are the spec files found inside this dir :
- ${specFiles.join("\n")}`);
