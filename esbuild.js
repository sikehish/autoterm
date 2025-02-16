const esbuild = require("esbuild");

const production = process.argv.includes("--production");
const watch = process.argv.includes("--watch");

async function main() {
  const ctxExtension = await esbuild.context({
    entryPoints: ["src/extension.ts"],
    bundle: true,
    format: "cjs",
    minify: production,
    sourcemap: !production,
    platform: "node",
    outfile: "dist/extension.js",
    external: ["vscode"],
  });

  const ctxWebview = await esbuild.context({
    entryPoints: ["src/webview/script.ts"],
    bundle: true,
    format: "iife",
    minify: production,
    sourcemap: !production,
    outfile: "dist/script.js",
  });

  if (watch) {
    await ctxExtension.watch();
    await ctxWebview.watch();
  } else {
    await ctxExtension.rebuild();
    await ctxWebview.rebuild();
    await ctxExtension.dispose();
    await ctxWebview.dispose();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
