import { getMatchingPaths } from "../FileWalker.js";

/**
 * Build a Next.JS getStaticPaths() function
 * @see https://nextjs.org/docs/basic-features/data-fetching#getstaticpaths-static-generation
 * @param {String} contentDir
 * @param {String} propertyName
 * @return {Function}
 */
export const getStaticPathsFrom = (contentDir, propertyName) => async () => {
	let paths = await getMatchingPaths(contentDir, [".md", ".markdown"]);

	paths = paths.map((path) => {
		const params = {};
		params[propertyName] = path
			.toLowerCase()
			.replace(/\.md|\.markdown$/, "") // remove markdown extension : /home.md => /home
			.replace(/\\index$/, "") // remove '/index' : /blog/index => /blog
			.split("/"); // split parts
		return { params };
	});

	return { paths };
};
