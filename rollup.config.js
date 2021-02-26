import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import typescript from "@rollup/plugin-typescript";
import fs from "fs";
import css from "rollup-plugin-css-only";
import livereload from "rollup-plugin-livereload";
import svelte from "rollup-plugin-svelte";
import { terser } from "rollup-plugin-terser";
import sveltePreprocess from "svelte-preprocess";

const production = !process.env.ROLLUP_WATCH;
const __BASE_DIR__ = process.env.BASE_DIR || "/";

function serve() {
	let server;

	function toExit() {
		if (server) server.kill(0);
	}

	return {
		writeBundle() {
			if (server) return;
			server = require("child_process").spawn(
				"npm",
				["run", "start", "--", "--dev"],
				{
					stdio: ["ignore", "inherit", "inherit"],
					shell: true,
				},
			);

			process.on("SIGTERM", toExit);
			process.on("exit", toExit);
		},
	};
}

export default [
	{
		input: "src/main.ts",
		output: {
			sourcemap: !production,
			format: "iife",
			name: "app",
			file: "public/build/bundle.js",
		},
		plugins: [
			svelte({
				preprocess: sveltePreprocess({
					postcss: {
						plugins: [
							require("tailwindcss"),
							require("autoprefixer"),
							require("postcss-nesting"),
						],
					},
					sourceMap: !production,
				}),
				compilerOptions: {
					// enable run-time checks when not in production
					dev: !production,
				},
			}),
			// we'll extract any component CSS out into
			// a separate file - better for performance
			css({ output: "bundle.css" }),

			// If you have external dependencies installed from
			// npm, you'll most likely need these plugins. In
			// some cases you'll need additional configuration -
			// consult the documentation for details:
			// https://github.com/rollup/plugins/tree/master/packages/commonjs
			resolve({
				browser: true,
				dedupe: ["svelte"],
			}),
			replace({
				__buildDate__: () => JSON.stringify(new Date().toISOString()),
				__dev__: !production,
				__BASE_DIR__: JSON.stringify(__BASE_DIR__),
				preventAssignment: true,
			}),
			commonjs(),
			typescript({
				sourceMap: !production,
				inlineSources: !production,
			}),

			// In dev mode, call `npm run start` once
			// the bundle has been generated
			!production && serve(),

			// Watch the `public` directory and refresh the
			// browser on changes when not in production
			!production && livereload("public"),

			// If we're building for production (npm run build
			// instead of npm run dev), minify
			production && terser(),

			generateIndexDocument(),
			generateBuildInfo(),
		],
		watch: {
			clearScreen: false,
		},
	},
	{
		input: "src/service-worker.ts",
		output: {
			sourcemap: !production,
			format: "iife",
			name: "serviceWorker",
			file: "public/service-worker.js",
		},
		plugins: [
			replace({
				__buildDate__: () => JSON.stringify(new Date().toISOString()),
				__dev__: !production,
				__BASE_DIR__: JSON.stringify(__BASE_DIR__),
				preventAssignment: true,
			}),
			commonjs(),
			typescript({
				sourceMap: !production,
				inlineSources: !production,
				isolatedModules: false,
			}),
			production && terser(),
		],
		watch: {
			clearScreen: false,
		},
	},
];

function generateIndexDocument() {
	return {
		generateBundle(options, bundle, isWrite) {
			if (!isWrite) {
				return;
			}

			fs.writeFileSync(
				`${__dirname}/public/index.html`,
				fs
					.readFileSync(`${__dirname}/src/index.html`)
					.toString()
					.replace(/%BASE_DIR%/g, __BASE_DIR__),
			);

			fs.writeFileSync(
				`${__dirname}/public/manifest.webmanifest`,
				JSON.stringify(
					JSON.parse(
						fs
							.readFileSync(
								`${__dirname}/src/manifest.webmanifest`,
							)
							.toString()
							.replace(/%BASE_DIR%/g, __BASE_DIR__),
					),
				),
			);
		},
	};
}

function generateBuildInfo() {
	return {
		generateBundle(options, bundle, isWrite) {
			if (!isWrite) {
				return;
			}

			fs.writeFileSync(
				`${__dirname}/public/build.txt`,
				`Build Date: ${new Date().toISOString()}`,
			);
		},
	};
}
