# ⚡ CSSX (Prototype)

🚨 This is **not production-ready** — it’s a vision + experimental starting point for a new way of styling.

---

## ✨ What is CSSX?
CSSX is a wild idea:  
- Write `.cssx` files like normal CSS  
- But sprinkle in **JavaScript expressions + helpers**  
- Let the runtime handle reactivity, state, and hot reload  

---

## 🧪 Example

```css
/* styles.cssx */
.card {
  background: ${ theme("#111", "#fff") };
  font-size: ${ clamp(14, state.count, 40) }px;
  border: ${ once(() => rand(1, 5)) }px solid blue;
}

## Import and use**

import { cssx } from "cssx-runtime";

cssx.loadFile("/styles.cssx");
cssx.setState({ theme: "dark", count: 10 });

****

CSSX then compiles + runs them at runtime with state, functions, and built-in helpers.

Think CSS + Reactivity + Stdlib → but without needing Tailwind, Sass, or Styled Components.

🛠️ What’s Inside

cssx-runtime → the engine that loads .cssx, tracks state, applies to <style>

cssx-compile-core → compiles .cssx → .css + .cssx.map.json

helpers → px(), rem(), theme(), once(), rand(), etc.

🚀 Why?

Because plain CSS feels static.
CSSX makes styles alive: driven by logic, state, and reactivity — but without frameworks.

⚠️ Disclaimer

This repo is early, untested, and experimental.
It’s here so that anyone interested can read through the files, fork, and push the idea forward.

📚 Inspiration

Sass/LESS → preprocessing

Styled Components → JS in CSS

Tailwind → utility-driven styles

But CSSX? → stateful, dynamic, reactive CSS

🤝 Contribute

If this excites you, fork it, play with it, and share ideas. Let’s invent something new.

🚀 Features
✅ Reactive CSS driven by state (cssx.setState({ ... }))

✅ Built-in helpers: px(), rem(), theme(), once(), rand(), darken(), etc.

✅ Framework-agnostic: works in React, Vue, plain JS, anything.

✅ Hot Reload: edit .cssx files → instant update.

✅ SSR-safe design (runtime eval only in browser).

✅ No boilerplate — zero config, just import runtime.


📚 Built-in Helpers
Values → px(), rem(), em(), percent()

State → theme(dark, light), toggle(...)

Once/Memo → once(fn), memo(fn, key)

Responsive → media(query, val), breakpoint("sm", val)

Math → clamp(min, val, max), between(min, max, ratio), rand(min, max)

Colors → darken(color, p), lighten(color, p), alpha(color, a)

💡 Philosophy
CSSX is not “just another preprocessor.”
It’s a new way of thinking about style:

Styles are alive, connected to state and logic.

No more bloated frameworks or endless class utilities.

Just pure CSS + superpowers.

🔮 Roadmap
 VSCode syntax highlighting for .cssx

 More built-in helpers (grid(), fluid())

 React/Vue official bindings

 SSR hydration helpers