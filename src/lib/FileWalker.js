import fs from "fs";
import EventEmitter from "events";
import VFile from "./VFile.js";

const _DEFAULT_OPTIONS = {
	filterFiles: () => true,
	filterDirs: () => true
};

/**
 * @class FileWalker
 */
export class FileWalker extends EventEmitter {
	/**
	 * Build a new file walker event emitter
	 * @param {FileWalkerOptions} options
	 */
	constructor({ filterFiles, filterDirs } = _DEFAULT_OPTIONS) {
		super();

		this.filterFiles(filterFiles).filterDirs(filterDirs);
	}

	filterFiles(fn) {
		if (typeof fn !== "function") {
			throw new TypeError(
				`FileWalker() The 'filterFiles' and 'filterDirs' must be functions`
			);
		}
		this._filterFiles = fn;
		return this;
	}
	filterDirs(fn) {
		if (typeof fn !== "function") {
			throw new TypeError(
				`FileWalker() The 'filterFiles' and 'filterDirs' must be functions`
			);
		}
		this._filterDirs = fn;
		return this;
	}

	/**
	 * Explore one directory level and emits events based on what is found
	 * @param {String} dir - full path
	 */
	async explore(dir) {
		// Check that this directory really exists
		if (!dir || !fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) {
			throw new Error(
				`FileWalker() The directory to explore doesn't exist. (${dir}/)`
			);
		}

		this._fileCount = 0;

		try {
			const entries = await fs.readdir(dir, { withFileTypes: true });
			this._fileCount += entries.length;

			for (const entry of entries) {
				if (entry.isFile()) {
					// Emit a `file` event if it conforms to the spec
					if (this._filterFiles(VFile(entry.name))) {
						this.emit("file", relative(dir, entry.name));
					}
				} else if (entry.isDirectory()) {
					if (this._filterDirs(VFile(entry.name))) {
						this.emit("dir", relative(dir, entry.name) + "/");
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
		this._fileCount--;
		if (this._fileCount === 0) {
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
			new FileWalker()
				.filterFiles(hasExtension(extensions))
				.on("dir", (dir) => {
					console.debug(`Exploring ${dir}/ for more content`);
				})
				.on("file", (path) => {
					paths.push(path);
					console.debug(`File ${path} was added to content`);
				})
				.on("error", reject)
				.on("end", resolve)
				.explore(dir);
		});

		return paths;
	} catch (err) {
		const ERR_MSG = `getStaticPaths(): Error when trying to retrieve a list of content inside "${dir}"
${err}`;
		console.error(ERR_MSG);
		throw new Error(ERR_MSG);
	}
};

export default FileWalker;
