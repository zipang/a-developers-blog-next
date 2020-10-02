import { parse, dirname } from "path";

/**
 * Easily read properties of a file
 * @example
 *   const readmeFile = VFile("/project/readme.md")
 *   console.log(readmeFile.ext) => "md"
 *   console.log(readmeFile.filename) => "readme"
 *   console.log(readmeFile.dir) => "/project"
 * @param {String} fullpath
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
