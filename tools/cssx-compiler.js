#!/usr/bin/env node

/**
 * cssx-compiler.js
 *
 * Usage:
//   node cssx-compiler.js "src/**/
// *.cssx" --functions ./build/functions.js
//  *
//  * Outputs for each input `path/name.cssx`:
//  *   - path/name.css
//  *   - path/name.cssx.map.json
//  *
//  * Behavior:
//  *  - Evaluates expressions inside ${ ... } using Node's vm with a sandbox.
//  *  - If evaluation succeeds and returns string/number/boolean, it's inlined.
//  *  - If evaluation throws or returns undefined/non-primitive, a placeholder is inserted
//  *    and the expression is recorded in the .cssx.map.json file.
// */

const fs = require("fs");
const path = require("path");
const vm = require("vm");
const glob = require("glob");

function usage() {
    console.log(`
cssx-compiler.js — compile .cssx -> .css + .cssx.map.json

Usage:
  node cssx-compiler.js "<glob-or-file>" [--functions ./build/functions.js]

Examples:
  node cssx-compiler.js "src/styles/*.cssx"
  node cssx-compiler.js src/styles/app.cssx --functions build/cssx.functions.js
`);
}

if (process.argv.length < 3) {
    usage();
    process.exit(1);
}

const inputPattern = process.argv[2];
let functionsPath = null;

for (let i = 3; i < process.argv.length; i++) {
    if (process.argv[i] === "--functions") {
        functionsPath = process.argv[i + 1];
        i++;
    }
}

// Load optional functions module (if provided)
let buildFunctions = {};
if (functionsPath) {
    const abs = path.resolve(process.cwd(), functionsPath);
    if (!fs.existsSync(abs)) {
        console.error(`Functions file not found: ${abs}`);
        process.exit(1);
    }
    try {
        // require the module — it should export either object or default object
        const moduleExports = require(abs);
        buildFunctions = moduleExports && moduleExports.default ? moduleExports.default : moduleExports;
        if (typeof buildFunctions !== "object") buildFunctions = {};
    } catch (e) {
        console.error(`Error loading functions module: ${e.message}`);
        process.exit(1);
    }
}

const matches = glob.sync(inputPattern, { nodir: true });
if (matches.length === 0) {
    console.error("No files matched pattern:", inputPattern);
    process.exit(1);
}

console.log(`Compiling ${matches.length} file(s)...`);

matches.forEach((file) => {
    try {
        const src = fs.readFileSync(file, "utf8");

        let exprIndex = 0;
        const dynamicExprs = [];

        // Replace ${ ... } expressions
        const compiled = src.replace(/\$\{([^}]+)\}/g, (full, expr) => {
            const trimmed = expr.trim();

            // Sandbox context: only primitive state the build knows + helpers
            const sandbox = Object.assign({}, buildFunctions);
            // Optionally, you can add constants like NODE_ENV to sandbox:
            sandbox.NODE_ENV = process.env.NODE_ENV || "development";

            // vm context
            const context = vm.createContext(sandbox);

            try {
                // We evaluate the expression in the VM. Return value is accepted if primitive.
                const script = new vm.Script(trimmed, { filename: `${path.basename(file)}::expr` });
                const result = script.runInContext(context, { timeout: 1000 });

                // Accept strings/numbers/booleans
                if (
                    typeof result === "string" ||
                    typeof result === "number" ||
                    typeof result === "boolean"
                ) {
                    // If string contains newlines and looks like block rules, just return as-is
                    if (typeof result === "string") {
                        // Strip surrounding quotes if any (defensive)
                        let r = result.replace(/^"(.*)"$/, "$1").replace(/^'(.*)'$/, "$1");
                        return r;
                    }
                    return String(result);
                }

                // If result is undefined/null/object/function -> treat as dynamic placeholder
                throw new Error("Non-primitive or undefined result");
            } catch (e) {
                // Create placeholder and add to dynamicExprs
                const placeholder = `__CSSX_EXPR_${exprIndex++}__`;
                dynamicExprs.push({ placeholder, expr: trimmed });
                return placeholder;
            }
        });

        const outCssPath = file.replace(/\.cssx$/, ".css");
        const mapPath = file.replace(/\.cssx$/, ".cssx.map.json");

        // Write CSS output
        fs.writeFileSync(outCssPath, compiled, "utf8");
        console.log(`Wrote ${outCssPath}`);

        // Write map file with dynamic expressions
        if (dynamicExprs.length > 0) {
            fs.writeFileSync(mapPath, JSON.stringify(dynamicExprs, null, 2), "utf8");
            console.log(`Wrote ${mapPath} (${dynamicExprs.length} dynamic exprs)`);
        } else {
            // Remove stale map if exists
            if (fs.existsSync(mapPath)) fs.unlinkSync(mapPath);
        }
    } catch (err) {
        console.error(`Failed to compile ${file}:`, err);
    }
});

console.log("Done.");
