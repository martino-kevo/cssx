// core engine (auto when user installs package)

export class CSSX {
    constructor() {
        this.state = {};
        this.functions = {};
        this.files = [];
        this.styleEl = document.createElement("style");
        document.head.appendChild(this.styleEl);

        // ✅ Register stdlib
        this.registerFunctions({

            /* ────────────── 1. Value Helpers ────────────── */
            px: v => `${v}px`,
            rem: v => `${v}rem`,
            em: v => `${v}em`,
            percent: (v, total) => `${(v / total) * 100}%`,

            /* ────────────── 2. State-aware ────────────── */
            theme: (dark, light) => this.state.theme === "dark" ? dark : light,
            toggle: (...values) => {
                let i = 0;
                return () => values[(i++) % values.length];
            },

            /* ────────────── 3. One-shot Helpers ────────────── */
            once: (() => {
                const cache = new Map();
                return (fn, key) => {
                    if (!key) key = fn.toString();
                    if (cache.has(key)) return cache.get(key);
                    const val = fn();
                    cache.set(key, val);
                    return val;
                };
            })(),

            memo: (() => {
                const cache = new Map();
                return (fn, key) => {
                    if (cache.has(key)) return cache.get(key);
                    const val = fn();
                    cache.set(key, val);
                    return val;
                };
            })(),

            /* ────────────── 4. Responsive ────────────── */
            media: (q, val) => window.matchMedia(q).matches ? val : null,
            breakpoint: (name, val) => {
                const map = {
                    sm: "(max-width: 640px)",
                    md: "(max-width: 768px)",
                    lg: "(max-width: 1024px)",
                    xl: "(max-width: 1280px)",
                };
                return window.matchMedia(map[name] || name).matches ? val : null;
            },

            /* ────────────── 5. Math Helpers ────────────── */
            clamp: (min, val, max) => Math.min(Math.max(val, min), max),
            between: (min, max, ratio) => min + (max - min) * ratio,
            rand: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,

            /* ────────────── 6. Color Helpers ────────────── */
            darken: (color, percent) => {
                let [r, g, b] = CSSX.hexToRgb(color);
                r = Math.max(0, r - (r * percent) / 100);
                g = Math.max(0, g - (g * percent) / 100);
                b = Math.max(0, b - (b * percent) / 100);
                return `rgb(${r}, ${g}, ${b})`;
            },

            lighten: (color, percent) => {
                let [r, g, b] = CSSX.hexToRgb(color);
                r = Math.min(255, r + (255 - r) * (percent / 100));
                g = Math.min(255, g + (255 - g) * (percent / 100));
                b = Math.min(255, b + (255 - b) * (percent / 100));
                return `rgb(${r}, ${g}, ${b})`;
            },

            alpha: (color, a) => {
                let [r, g, b] = CSSX.hexToRgb(color);
                return `rgba(${r}, ${g}, ${b}, ${a})`;
            },
        });
    }

    /* Utility: parse hex or rgb strings into [r,g,b] */
    static hexToRgb(color) {
        if (color.startsWith("#")) {
            let hex = color.slice(1);
            if (hex.length === 3) hex = hex.split("").map(c => c + c).join("");
            const bigint = parseInt(hex, 16);
            return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
        }
        const match = color.match(/(\d+),\s*(\d+),\s*(\d+)/);
        return match ? [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])] : [0, 0, 0];
    }

    registerFunctions(funcs) {
        Object.assign(this.functions, funcs);
    }

    setState(newState) {
        Object.assign(this.state, newState);
        this.update();
    }

    async loadFile(path, watch = false) {
        const cssPath = path.replace(".cssx", ".css");
        const mapPath = path.replace(".cssx", ".cssx.map.json");

        // Load compiled CSS
        const cssRes = await fetch(cssPath + (watch ? `?t=${Date.now()}` : ""));
        const cssCode = await cssRes.text();

        // Load dynamic expressions
        let exprs = [];
        try {
            const mapRes = await fetch(mapPath + (watch ? `?t=${Date.now()}` : ""));
            exprs = await mapRes.json();
        } catch { }

        // Save
        const idx = this.files.findIndex(f => f.path === path);
        if (idx >= 0) this.files[idx] = { path, cssCode, exprs };
        else this.files.push({ path, cssCode, exprs });

        this.update();
    }

    // 🎯 Dev helper: auto-reload .cssx every X ms
    enableHotReload(interval = 1000) {
        setInterval(() => {
            this.files.forEach(f => this.loadFile(f.path, true));
        }, interval);
    }


    update() {
        let compiled = "";

        for (const { cssCode, exprs } of this.files) {
            let current = cssCode;

            if (exprs && exprs.length > 0) {
                exprs.forEach(({ placeholder, expr }) => {
                    try {
                        const scope = { ...this.state, ...this.functions };
                        let result = Function(...Object.keys(scope), `return ${expr}`)(...Object.values(scope));

                        if (typeof result === "string") {
                            result = result.replace(/^"(.*)"$/, "$1").replace(/^'(.*)'$/, "$1");
                        }

                        current = current.replace(new RegExp(placeholder, "g"), result);
                    } catch (e) {
                        console.warn("CSSX runtime error in expr:", expr, e);
                    }
                });
            }

            compiled += current + "\n";
        }

        this.styleEl.textContent = compiled;
    }
}

export const cssx = new CSSX();

