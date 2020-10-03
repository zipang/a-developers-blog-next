import test from "baretest";
import code from "@hapi/code";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

import VFile, { hasExtension } from "./VFile.js";

// REBUILD THE COMMON JS ENV VARIABLES
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const testSuite = test("VFile");
const { expect } = code;

const me = VFile(__filename);

/**
 * Check the VFile
 */
testSuite("VFile exposes simple accessosrs to file path parts", () => {
	expect(me.name).to.equal("VFile.spec");
	expect(me.ext).to.equal("js");
	expect(me.dir).to.equal(__dirname);
});

/**
 * Check the VFile
 */
testSuite("hasExtension('.js') should be true", () => {
	const isJs = hasExtension(".js");
	expect(isJs(me)).to.be.true();
});
testSuite("hasExtension('.spec.js') can handle a long extension", () => {
	const isSpec = hasExtension(".spec.js");
	expect(isSpec(me)).to.be.true();
});
testSuite(
	"hasExtension('js', 'txt', 'md') test if file has at least one of these extensions",
	() => {
		const isSpec = hasExtension(".spec.js");
		expect(isSpec(me)).to.be.true();
	}
);

testSuite.run();
