import { parse, dirname } from "path";

/**
 * Build a quick file filter based on accepted extensions
 * @param  {...string} extensions - accepted extensions
 * @return Function(<VFile|String>)
 */
export const hasExtension = (...extensions) => (vfile) => {
	if (!vfile) return false;
	const filename = typeof vfile === "string" ? vfile : vfile.filename;
	return extensions.some((ext) => filename.endsWith(ext));
};

/**
 * Common and useful file filters
 * Each file filter receive a VFile object as parameter and must return a boolean to accept or reject the file
 */
export const fileFilters = {
	isMarkdown: hasExtension("md", "markdown"),
	isText: hasExtension("txt"),
	isHidden: (vfile) => vfile.name.startsWith(".")
};

/**
 * Easily read properties of a file
 * @example
 *   const readmeFile = VFile("/project/readme.md")
 *   console.log(readmeFile.ext) => "md"
 *   console.log(readmeFile.filename) => "readme"
 *   console.log(readmeFile.dir) => "/project"
 * @param {String} fullpath
 * @return VFile
 */
const VFile = (fullpath) => {
	const { dir, base, ext, name } = parse(fullpath);

	return {
		path: dir,
		dir: dirname(fullpath),
		filename: base,
		name,
		ext: ext.substring(1)
	};
};

export default VFile;
