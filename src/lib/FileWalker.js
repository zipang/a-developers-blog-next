import fs from "fs-extra";
import { relative, basename, extname, dirname } from "path";

const VFilePropertyHandler = {
	get: (target, property) => {
		switch (property) {
			case "basename":
				return basename(target);
				break;
			case "extname":
				return extname(target);
				break;
			case "dirname":
				return dirname(target);
				break;

			default:
				return `Unknown property ${property} called on VFile`;
		}
	}
};

/**
 * A proxy to easily read properties of a file
 * @example
 *   const readmeFile = VFile("/project/readme.md")
 *   console.log(readmeFile.extname) // "md"
 *   console.log(readmeFile.extname) // "readme"
 *   console.log(readmeFile.dirname) // "project"
 * @param {String} path
 */
const VFile = (path) => new Proxy(path, VFilePropertyHandler);

/**
 * Build a quick file filter based on accepted extensions
 * @param  {...string} extensions - accepted extensions
 */
export const hasExtensions = (...extensions) => (vfile) => extensions.find(vfile.extname);

/**
 * Common and useful file filters
 * Each file filter receive a VFile object as parameter and must return a boolean to accept or reject the file
 */
export const fileFilters = {
	isMarkdown: hasExtensions("md", "markdown"),
	isText: hasExtensions("txt"),
	isHidden: (vfile) => vfile.basename
};

const _DEFAULT_OPTIONS = {
	filterFiles: () => true,
	filterDirs: () => true
};

export class FileWalker extends EventEmitter {
	/**
	 * Build a new file walker event emitter
	 * @param {String} dir
	 * @param {FileWalkerOptions} options
	 */
	constructor(dir, { filterFiles, filterDirs } = _DEFAULT_OPTIONS) {
		super();
		// Check that we can really do this
		if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) {
			throw new Error(
				`FileWalker() The directory to scan doesn't exist. (${dir}/)`
			);
		}
		if (typeof filterFiles !== "function" || typeof filterFiles !== "function") {
			throw new TypeError(
				`FileWalker() The 'filterFiles' and 'filterDirs' optional handlers must be functions`
			);
		}
		this.root = dir;
		this.fileCount = 0;
		this.filterFiles = filterFiles;
		this.filterDirs = filterDirs;
		this.explore(dir);
	}

	/**
	 * Explore one directory level and emits events based on what is found
	 * @param {String} dir - full path
	 */
	async explore(dir) {
		try {
			const entries = await fs.readdir(dir, { withFileTypes: true });
			this.fileCount += entries.length;

			for (const entry of entries) {
				if (entry.isFile()) {
					// Emit a `file` event if it conforms to the spec
					if (this.filterFiles(VFile(entry.name))) {
						this.emit("file", relative(this.root, entry.name));
					}
				} else if (entry.isDirectory()) {
					if (this.filterDirs(VFile(entry.name))) {
						this.emit("dir", relative(this.root, entry.name) + "/");
						this.explore(entry.name);
					}
				}
				this.checkDone();
			}
		} catch (err) {
			this.emit("error", err);
		}
	}

	checkDone() {
		this.fileCount--;
		if (this.fileCount === 0) {
			this.emit("end");
		}
	}
}

/**
 * Get a static list of paths to content files inside a directory
 * @param {String} dir
 * @param {Array[String]} extensions - file extensions to retrieve
 * @return {Array[String]} matching paths relative to the provided root dir
 **/
export const getStaticPaths = async (dir, extensions) => {
	try {
		const paths = [];

		await new Promise((resolve, reject) => {
			new FileWalker(dir, {
				filterFiles: hasExtensions(extensions)
			})
				.on("dir", (dir) => {
					console.debug(`Exploring ${dir}/ for more content`);
				})
				.on("file", (path) => {
					paths.push(path);
					console.debug(`File ${path} was added to content`);
				})
				.on("error", reject)
				.on("end", resolve);
		});

		return paths;
	} catch (err) {
		const ERR_MSG = `getStaticPaths(): Error when trying to retrieve a list of content inside "${dir}"`;
		console.error(ERR_MSG);
		throw new Error(ERR_MSG);
	}
};

export default FileWalker;
