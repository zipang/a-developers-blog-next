import FileWalker from "./FileWalker";
import test from "baretest";
import { expect } from "@hapi/code";

test("FileWalker will throw on not existing dir", () => {
	const badInstantiation = () => {
		const walker = new FileWalker("toto");
	};

	expect(badInstantiation).to.throw();
});

test.arguments();
