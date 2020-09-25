import { VFile } from "./FileWalker.js";
import path from "path";

const f = VFile(path.join(__dirname, "FileWalker.spec.js"));

console.dir(process.env);

console.log(`f : ${f}`);
console.log(`f.extname : ${f.extname}`);
console.log(`f.basename : ${f.basename}`);
