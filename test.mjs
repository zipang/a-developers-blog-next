import FileWalker from "./src/lib/FileWalker.js";

let tests = [],
	success = 0,
	errors = 0;

const isSpec = ({ filename }) => filename.split(".").includes("spec");

/**
 *
 * @param {String} testFile Full path of the test file
 */
const addTest = async (testFile) => {
	try {
		const { default: testSuite } = await import(testFile);
		tests.push(testSuite);
	} catch (err) {
		// The test file is broken : couldn't load it !
		tests.push({
			// create a test suite that will fail
			run: () => {
				throw `${testFile} test file was invalid`;
			}
		});
	}
};

/**
 * Run a single test suite
 * @param {Baretest} testSuite An async test suite with the run method
 */
const runTest = async (testSuite) => {
	try {
		await testSuite.run();
		success++;
	} catch (err) {
		errors++;
	}
};

/**
 *
 */
const runAll = async () => {
	await Promise.all(tests.map(runTest));
	if (errors === 0) {
		console.log(`All ${success} test suites have ended with success`);
	} else {
		console.log(
			`Some test suite have failed (${error} failed, ${success} succeeded)`
		);
	}
	process.exit(errors);
};

const sourceDir = join(process.cwd(), "src");
new FileWalker()
	.filterFiles(isSpec)
	.on("file", addTest)
	.on("end", runAll)
	.explore(sourceDir);
