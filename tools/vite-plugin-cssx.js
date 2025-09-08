// tools/vite-plugin-cssx.js
import fs from "fs";
import { createFilter } from "vite";
import { compileCssx } from "./cssx-compiler-core.js";

export default function cssxPlugin(options = {}) {
    const filter = createFilter(/\.cssx$/);
    const ssrCssMap = new Map();

    return {
        name: "vite-plugin-cssx",

        async transform(src, id, ssr) {
            if (!filter(id)) return null;

            const { css, map, cssPath, mapPath } = compileCssx(
                id,
                src,
                options.functions || {},
                options.staticState || {}
            );

            fs.writeFileSync(cssPath, css, "utf8");

            if (map.length > 0) {
                fs.writeFileSync(mapPath, JSON.stringify(map, null, 2), "utf8");
            } else if (fs.existsSync(mapPath)) {
                fs.unlinkSync(mapPath);
            }

            if (ssr) {
                ssrCssMap.set(id, css);
            }

            return {
                code: `import "${cssPath}";`,
                map: null,
            };
        },

        transformIndexHtml(html) {
            if (ssrCssMap.size === 0) return html;
            const allCss = Array.from(ssrCssMap.values()).join("\n");
            return html.replace("</head>", `<style id="cssx-ssr">${allCss}</style>\n</head>`);
        },
    };
}
