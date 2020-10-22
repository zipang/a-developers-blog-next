// @ts-nocheck
// next.config.js
const path = require("path");

module.exports = {
	contentDir: path.join(process.cwd(), "content"),
	reactStrictMode: true,
	webpack: (config, options) => {
		config.module.rules.push({
			test: /\.md$/,
			use: [
				{
					loader: "gray-matter-loader",
					options: {}
				}
			]
		});

		return config;
	}
};
