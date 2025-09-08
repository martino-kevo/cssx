// tools/cssx-compiler-core.js
import fs from "fs";

// Mini evaluator with safe fallback
function tryEval(expr, scope) {
    try {
        return Function(...Object.keys(scope), `return ${expr}`)(...Object.values(scope));
    } catch {
        return null; // signal: needs runtime
    }
}

export function compileCssx(filePath, source, functions = {}, staticState = {}) {
    const cssPath = filePath.replace(/\.cssx$/, ".css");
    const mapPath = filePath.replace(/\.cssx$/, ".cssx.map.json");

    const exprRegex = /\$\{([^}]+)\}/g;
    let css = source;
    let map = [];

    css = css.replace(exprRegex, (_, expr) => {
        const scope = { ...staticState, ...functions };
        const result = tryEval(expr, scope);

        if (result !== null && result !== undefined) {
            // ✅ Compile-time value
            return typeof result === "string"
                ? result.replace(/^['"](.*)['"]$/, "$1")
                : result;
        } else {
            // 🔧 Needs runtime
            const placeholder = `__CSSX_EXPR_${map.length}__`;
            map.push({ placeholder, expr });
            return placeholder;
        }
    });

    return { css, map, cssPath, mapPath };
}
