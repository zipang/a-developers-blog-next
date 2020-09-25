import FileWalker, { getStaticPaths } from "./lib/FileWalker.js";

let nbTests = 0,
	success = 0,
	errors = 0;

const isSpec = (p) => p.split(".").includes("spec");

const runTest = async (test) => {
	try {
		test.run();
	} catch (err) {
		errors++;
	}
};

new FireWalker("src").filterFiles(isSpec).on("file", runTest).on("end", checkSuccess);
