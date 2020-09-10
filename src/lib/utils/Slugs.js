/**
 * Used to slugify paths so that they are URL safe
 * @param {String} pathPart
 * @return {String}
 */
export const slugifyPart = (pathPart = "") => {
	return pathPart
		.toLowerCase()
		.replace(/[^a-z0-9\-]/g, "_")
		.replace(/_+/g, "_")
		.replace(/^_|_$/g, "");
};

/**
 * Transform the file path to a path URL
 * Get rid of the extension, lowercase everything
 * Forbidden letters are replaced by an underscore
 * Example :
 *   /home.md => /
 *   /Legal/Raunchy-stœff.md => /legal/raunchy-st_ff
 * @param {String} path
 */
export const pathParts = (root = "/", path = "") => {
	return path
		.split("/")
		.map(slugify)
		.join("/")
		.replace(/.md$/, "")
		.replace(/home$/, "");
};
