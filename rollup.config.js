import svelte from "rollup-plugin-svelte";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import livereload from "rollup-plugin-livereload";
import { terser } from "rollup-plugin-terser";
import replace from "@rollup/plugin-replace";
import fs from "fs";

const production = !process.env.ROLLUP_WATCH;

export default [
  {
    input: "src/main.js",
    output: {
      sourcemap: true,
      format: "iife",
      name: "app",
      file: "public/build/bundle.js",
    },
    plugins: [
      svelte({
        dev: !production,
        css: (css) => {
          css.write("public/build/bundle.css");
        },
      }),
      resolve({
        browser: true,
        dedupe: ["svelte"],
      }),
      commonjs(),
      !production && serve(),
      !production && livereload("public"),
      production && terser(),
      buildTimestamp(),
    ],
    watch: {
      clearScreen: false,
    },
  },
  {
    input: "src/service-worker.js",
    output: {
      sourcemap: true,
      format: "iife",
      name: "serviceWorker",
      file: "public/service-worker.js",
    },
    plugins: [
      replace({
        __buildDate__: () => JSON.stringify(new Date().toISOString()),
        __dev__: !production,
      }),
      commonjs(),
      production && terser(),
    ],
    watch: {
      clearScreen: false,
    },
  },
];

function serve() {
  let started = false;

  return {
    writeBundle() {
      if (!started) {
        started = true;

        require("child_process").spawn("npm", ["run", "start", "--", "--dev"], {
          stdio: ["ignore", "inherit", "inherit"],
          shell: true,
        });
      }
    },
  };
}

function buildTimestamp() {
  return {
    generateBundle(options, bundle, isWrite) {
      if (!isWrite) {
        return;
      }

      fs.writeFileSync(
        `${__dirname}/public/build.txt`,
        `Build Date: ${new Date().toISOString()}`
      );
    },
  };
}
