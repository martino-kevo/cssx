// vite.config.js
import cssxPlugin from "./tools/vite-plugin-cssx.js";
import * as funcs from "./src/functions.js";

export default {
    plugins: [
        cssxPlugin({
            functions: funcs,
            staticState: { loggedIn: true, theme: "dark" } // 👈 resolved at build
        })
    ]
};



