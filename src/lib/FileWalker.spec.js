import FileWalker from "./FileWalker.js";
import test from "baretest";
import code from "@hapi/code";

const { expect } = code;
const testSuite = test("FileWalker");

testSuite("FileWalker will throw on not existing dir", () => {
	const badInstantiation = () => {
		const walker = new FileWalker("toto");
	};

	expect(badInstantiation).to.throw();
});

testSuite.run();
