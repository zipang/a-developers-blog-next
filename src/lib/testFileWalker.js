import path, { dirname } from "path";
import VFile from "./VFile.js";
import { hasExtension, getStaticPaths } from "./FileWalker.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log(`Current dir : ${__dirname}`);
const specFile = VFile(path.join(__dirname, "FileWalker.spec.js"));
isSpecFile = hasExtension(".spec.js")(specFile);

console.log(`File : ${specFile.path} is a spec file : ${isSpecFile}`);

// Filter spec files inside this dir
const specFiles = getStaticPaths(__dirname, ["spec.js"]);
console.log(`Here are the spec files found inside this dir :
- ${specFiles.join("\n")}`);
