import chokidar from "chokidar";

/**
 *
 * @param {String} dir - full path of the directory to watch
 * @param {String} glob - a glob pattern like **/*.md
 */
export const watchContent = async (dir, glob) => {
	return chokidar
		.watch("**/*.[md|markdown]", {
			cwd: dir
		})
		.on("add", (path) => {
			console.log(`Added ${path} to list of watched files`);
		})
		.getWatched();
};

export const getStaticPaths = async (dir, opts) => {};
