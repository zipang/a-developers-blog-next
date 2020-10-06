import test from "baretest";
import code from "@hapi/code";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const { expect } = code;
const testSuite = test("FlatFileContentProvider");

// REBUILD THE COMMON JS ENV VARIABLES
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import { getStaticPathsFrom } from "./FlatFileContentProvider.js";

const runCmd = async () => {
	const getStaticPaths = getStaticPathsFrom(
		join(__dirname, "../../../content"),
		"paths"
	);
	const staticPaths = await getStaticPaths();
	console.log(JSON.stringify(staticPaths));
};

runCmd();
