const { resolve } = require("path");
const readContent = require("./read");
const pageTemplate = resolve("./src/templates/pageTemplate.js");

const _DEFAULT_OPTIONS = {
	include: [".md"],
	exclude: ["node_modules/"],
};

/**
 * Create every pages by mapping content files to urls
 */
module.exports.createPages = async ({ actions }, options) => {

	const opts = Object.assign({}, _DEFAULT_OPTIONS, options);
	const { createPage } = actions;
	const { path } = opts;

	console.log(`Loading ${path}...`);
	const collections = await readContent(path, opts);

	collections.page.forEach((vfile) => {
		console.log(`Creating page ${vfile.data.path}`);
		createPage({
			path: vfile.data.path,
			component: pageTemplate,
			context: {
				local: vfile.data, // data belonging to the page
				global: collections.global, // data belonging to the site
			},
		});
	});

	console.dir(collections.global);
};

// module.exports.onCreateNode = ({ node }) => {
// 	console.dir(node);
// }
