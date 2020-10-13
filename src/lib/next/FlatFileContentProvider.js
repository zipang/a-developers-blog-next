import { getMatchingPaths } from "../FileWalker.js";
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
	const routes = {};

	// Search every markdown files inside contentDir
	let paths = await getMatchingPaths(contentDir, [".md", ".markdown"]);

	paths = paths.map((path) => {
		const route = path
			.toLowerCase()
			.replace(/\.md|\.markdown$/, "") // remove markdown extension : /home.md => /home
			.replace(/index$/, ""); // remove '/index' : /blog/index => /blog

		routes[route] = join(contentDir, path);
		// Now return the static paths like that { params : { propertyName: ["path1", "path2"] }}
		const params = {};
		params[propertyName] = route.split("/"); // split parts
		return { params };
	});

	console.dir(`Routes have been gathered from ${contentDir} : 
	${JSON.stringify(routes)}`);

	return { paths, fallback };
};

/**
 * Read the YAML + Markdown content of the file
 * @param {Context}
 */
export const getStaticPropsFor = (contentDir, paramName) => async ({ params }) => {
	try {
		console.log(`getStaticPropsFor(${JSON.stringify({ params })})`);
		const path = params[paramName] ? params[paramName].join("/") : "";
		const filename = getMatchingFileNameFor(contentDir, path);
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

const getMatchingFileNameFor = (contentDir, path) => {
	// 1st candidate : the path with the markdown extension
	let candidate = join(contentDir, `${path}.md`);
	if (fs.pathExistsSync(candidate)) return candidate;

	candidate = join(contentDir, path, "index.md");
	if (fs.pathExistsSync(candidate)) return candidate;

	throw new Error(`Couldn't find content file associated with path ${path}`);
};
