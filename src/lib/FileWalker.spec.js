import test from "baretest";
import code from "@hapi/code";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import FileWalker from "./FileWalker.js";
import { EventEmitter } from "events";

const { expect } = code;
const testSuite = test("FileWalker");

// REBUILD THE COMMON JS ENV VARIABLES
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Check the API
 */
testSuite("FileWalker can walk is own existing dir", () => {
	const WalkWithMe = new FileWalker();

	expect(WalkWithMe, "EventEmitter").to.be.an.instanceof(EventEmitter);
	expect(WalkWithMe.explore, ".explore()").to.be.an.instanceof(Function);
	expect(WalkWithMe.filterFiles, ".filterFiles()").to.be.an.instanceof(Function);
	expect(WalkWithMe.filterDirs, ".filterDirs()").to.be.an.instanceof(Function);
});

/**
 * Check the bad parameters
 */
testSuite("FileWalker.explore() will throw on not existing dir", () => {
	const walker = new FileWalker();

	const badDirectory = async () => {
		walker.explore("toto");
	};

	expect(badDirectory, "Bad path").to.throw();
});

testSuite.run();
