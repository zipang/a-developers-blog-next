import { getMatchingPaths } from "../FileWalker.js";
import fs from "fs-extra";
import { join } from "path";
import matter from "gray-matter";

// Store the full path to the content files indexed by their relative web URL
// Eg : blog/jamstack/git-based-cms => /www/my-app/content/blog/jamstack/git-based-cms.md
const routes = {};

/**
 * Build a Next.JS getStaticPaths() function
 * @see https://nextjs.org/docs/basic-features/data-fetching#getstaticpaths-static-generation
 * @param {String} contentDir
 * @param {String} propertyName
 * @return {Function}
 */
export const getStaticPathsFrom = (contentDir, propertyName) => async () => {
	// Search every markdown files inside contentDir
	let paths = await getMatchingPaths(contentDir, [".md", ".markdown"]);

	paths = paths.map((path) => {
		const route = path
			.toLowerCase()
			.replace(/\.md|\.markdown$/, "") // remove markdown extension : /home.md => /home
			.replace(/\\index$/, ""); // remove '/index' : /blog/index => /blog
		routes[route] = join(contentDir, path);
		// Now return the static paths like that { params : { propertyName: ["path1", "path2"] }}
		const params = {};
		params[propertyName] = route.split("/"); // split parts
		return { params };
	});

	return { paths };
};

/**
 * Read the YAML + Markdown content of the file
 * @param {Context}
 */
export const getStaticPropsFor = (paramName) => async ({ params }) => {
	try {
		const parts = params[paramName];
		const path = parts.join("/");
		const filename = routes[path];
		const fileContent = await fs.readFile(filename, "utf8");
		const props = { ...matter(fileContent) };
		return { props };
	} catch (err) {
		console.error(err);
		return {
			content: `Unable to load content for ${params} : ${err}`
		};
	}
};
