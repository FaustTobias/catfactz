module.exports = {
	...require("@faustt/prettier-config"),
	plugins: [
		...require("@faustt/prettier-config").plugins,
		require("prettier-plugin-svelte"),
	],
};
