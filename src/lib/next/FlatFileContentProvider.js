import { getMatchingPaths } from "../FileWalker.js";
import { routes } from "./RoutesProvider.js";
import fs from "fs-extra";
import { join } from "path";
import matter from "gray-matter";

/**
 * Build a Next.JS getStaticPaths() function
 * @see https://nextjs.org/docs/basic-features/data-fetching#getstaticpaths-static-generation
 * @param {String} contentDir
 * @param {String} propertyName
 * @return {Function}
 */
export const getStaticPathsFrom = (
	contentDir,
	propertyName,
	fallback = false
) => async () => {
	console.log(`getStaticPathsFrom("${contentDir}", "${propertyName}")`);

	// Search every markdown files inside contentDir
	let paths = await getMatchingPaths(contentDir, [".md", ".markdown"]);

	paths = paths.map((path) => {
		const route = path
			.toLowerCase()
			.replace(/\.md|\.markdown$/, "") // remove markdown extension : /home.md => /home
			.replace(/index$/, ""); // remove '/index' : /blog/index => /blog

		routes.set(route, join(contentDir, path));
		// Now return the static paths like that { params : { propertyName: ["path1", "path2"] }}
		const params = {};
		params[propertyName] = route.split("/"); // split parts
		return { params };
	});

	console.dir(`Routes have been gathered : ${routes.toString()}`);

	return { paths, fallback };
};

/**
 * Read the YAML + Markdown content of the file
 * @param {Context}
 */
export const getStaticPropsFor = (paramName) => async ({ params }) => {
	try {
		console.log(`getStaticPropsFor(${JSON.stringify({ params })})`);
		const path = params[paramName] ? params[paramName].join("/") : "";

		const filename = routes.get(path);
		const fileContent = await fs.readFile(filename, "utf8");
		const props = { ...matter(fileContent) };
		return { props };
	} catch (err) {
		console.error(err);
		return {
			props: {
				content: `Unable to load content for ${JSON.stringify(params)} : ${err}`
			}
		};
	}
};
