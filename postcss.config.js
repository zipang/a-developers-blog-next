const purgecss = [
	"@fullhuman/postcss-purgecss",
	{
		content: [".next/server/**/*.html"],
		defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || []
	}
];

const presets = [
	"postcss-preset-env",
	{
		autoprefixer: {
			flexbox: "no-2009"
		},
		stage: 3,
		features: {
			"custom-properties": false
		}
	}
];

module.exports = {
	plugins: [
		"postcss-import",
		presets,
		...(process.env.NODE_ENV === "production" ? [purgecss] : [])
	]
};
