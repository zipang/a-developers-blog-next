const { basename, extname, relative } = require("path");
const fs = require("fs");
require("./Array");

const walker = require("walker");

const _DEFAULT_INCLUDE = [".md", ".markdown"];
const _DEFAULT_EXCLUDE = ["node_modules/"];

/**
 * Explore the content directory
 * And store every parsed front-matter content inside specific collections : pages, global
 * @param {String} source  - path to read
 * @param {Object} options - include, exclude list like
 *   {
 *     include : [".md", ".markdown"],
 *     exclude: ["drafts/"]
 *   }
 * @return {Array[String]]}
 */
const walk = async (source, options = {}) => {
	try {
		if (!fs.existsSync(source) || !fs.statSync(source).isDirectory()) {
			throw new Error(`Given source ${source} must exist and must be a directory`);
		}

		const { include = _DEFAULT_INCLUDE, exclude = _DEFAULT_EXCLUDE } = options;
		const debug = console.debug;

		// 2. build an array containing only the directories names to be skipped (without the final /)
		// 3. and another one with only the names of files to be excluded..
		const [excludeDirs, excludeFiles] = exclude.part((name) => name.endsWith("/"));

		let files = [];

		await new Promise((resolve, reject) => {
			walker(source)
				.filterDir((dir) => {
					const dirname = basename(dir) + "/";
					return !excludeDirs.find((excluded) => excluded === dirname);
				})
				.on("dir", (dir) => {
					debug(`Exploring ${relative(source, dir)}/ for more content`);
				})
				.on("file", (path) => {
					let fileName = basename(path);
					// Check that we want this file first
					if (fileName.is(included) && !fileName.is(excluded)) {
						files.push(relative(source, path));
						debug(`File ${fileName} was added to content`);
					} else {
						debug(`File ${fileName} was excluded`);
					}
				})
				.on("error", reject)
				.on("end", resolve);
		});

		return files;
	} catch (err) {
		console.error(err);
		throw new Error(err);
	}
};

module.exports = walk;
