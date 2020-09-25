const { basename, relative } = require("path");
const fs = require("fs");
require("./Array");
const VFile = require("./vfile");
const walker = require("walker");
const matter = require("gray-matter");

/**
 * Explore the content directory
 * And store every parsed front-matter content inside specific collections : pages, global
 * @param {String} source - path to read
 * @param {Object} options - include, exclude list like
 *   {
 *     include : [".md", ".markdown"],
 *     exclude: ["drafts/"]
 *   }
 * @return {Object[collection:Array[VFile]]}
 */
const readContent = async (source, options = {}) => {
	try {
		if (!fs.existsSync(source) || !fs.statSync(source).isDirectory()) {
			throw new Error(
				`Given source ${source} must exist and must be a directory`
			);
		}

		const { include = [], exclude = ["node_modules/"] } = options;
		const debug = console.debug;

		// 2. build an array containing only the directories names to be skipped (without the final /)
		// 3. and another one with only the names of files to be excluded..
		const [excludeDirs, excludeFiles] = exclude.part((name) =>
			name.endsWith("/")
		);

		const glob = {};

		const collections = {
			global: glob,
		};

		/**
		 * Used to slugify page names so that they are URL safe
		 * @param {String} path
		 */
		function slugify(path = "") {
			let slug = path === "home" ? "" : path.toLowerCase();
			return slug
				.replace(/[^a-z0-9\-]/g, "_")
				.replace(/_+/g, "_")
				.replace(/^_|_$/g, "");
		}

		/**
		 * Transform the file path to a path URL
		 * Get rid of the extension, lowercase everything
		 * Forbidden letters are replaced by an underscore
		 * 'Home' is a special case
		 * Example :
		 *   /home.md => /
		 *   /Legal/Raunchy-stœff.md => /legal/raunchy-st_ff
		 * @param {String} path
		 */
		function createPath(path = "") {
			return "/" + path
				.split("/")
				.map(slugify)
				.join("/")
				.replace(/.md$/, "")
				.replace(/home$/, "");
		}

		/**
		 * Load and parse the front-matter content of a file
		 * and put them into their own collections (pages, global, ..)
		 */
		async function loadContent(vfile) {
			try {
				let { data } = matter(fs.readFileSync(vfile.path, "utf8"));

				vfile.path = relative(source, vfile.path);
				vfile.data = Object.assign(data, { path : createPath(vfile.path) });

				const { template } = data;

				if (data.global) {
					// we have a special collection for global data !
					// delete this redundant piece of information
					delete data.global;

					if (template === "metadata") {
						// Ok, lets make these key values pairs an object
						data = data.fields.reduce((accumulate, newValue) => {
							accumulate[newValue.key] = newValue.value;
							return accumulate;
						}, {});
					}

					// Global data are stored under their file name used as key
					// but because its annoying to quote a property name that contains `-`
					// we further hyphenate it..
					const slugg = slugify(vfile.stem).replace(/\-/g, "_");
					glob[slugg] = data;

				} else {
					if (!(template in collections)) collections[template] = [];
					collections[template].push(vfile);
				}
			} catch (err) {
				console.error(err);
			}
			return vfile;
		}

		let files = [];

		await new Promise((resolve, reject) => {
			walker(source)
				.filterDir((dir) => {
					const dirname = basename(dir) + "/";
					return !excludeDirs.find(
						(excluded) => excluded === dirname
					);
				})
				.on("dir", (dir) => {
					debug(`Exploring ${relative(source, dir)}/ for more content`);
				})
				.on("file", (path, stats) => {
					let vfile = new VFile({ path, stats });
					// Check that we want this file first
					const { basename, extname } = vfile;
					if (
						include.find((included) => included === extname) &&
						!excludeFiles.find((excluded) => excluded === basename)
					) {
						files.push(vfile);
						debug(`File ${basename} was added to content`);
					} else {
						debug(`File ${basename} was excluded`);
					}
				})
				.on("error", reject)
				.on("end", resolve);
		});

		// load the front-matter content of every file that have been included
		await Promise.all(files.map(loadContent));
		return collections;

	} catch (err) {
		console.error(err);
		throw new Error(err);
	}
};

module.exports = readContent;
