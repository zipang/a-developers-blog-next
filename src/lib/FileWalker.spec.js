import FileWalker from "./FileWalker.js";
import test from "baretest";
import code from "@hapi/code";
import { EventEmitter } from "events";

const { expect } = code;
const testSuite = test("FileWalker");

/**
 * Check the bad parameters
 */
testSuite("FileWalker will throw on not existing dir", () => {
	const badInstantiation = () => {
		const walker = new FileWalker("toto");
	};

	expect(badInstantiation, "Bad path").to.throw();
});

/**
 * Check the API
 */
testSuite("FileWalker can walk is own existing dir", () => {
	const WalkWithMe = new FileWalker(__dirname);

	expect(WalkWithMe, "EventEmitter").to.be.an.instanceof(EventEmitter);
	expect(WalkWithMe.explore, ".explore()").to.be.an.instanceof(Function);
});

testSuite.run();
