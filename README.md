# ⚡ CSSX
**CSS + JS = CSSX**  
Dynamic, reactive, framework-agnostic styling.

---

## ✨ What is CSSX?
CSSX is a new design philosophy:  
- Write `.cssx` files like normal CSS...  
- But inject **JavaScript expressions** directly inside:  
  ```css
  .box {
    background: ${ theme("black", "white") };
    width: ${ state.count * 10 }px;
    border: ${ once(() => rand(2, 8)) }px solid ${ darken("blue", 20) };
  }
CSSX then compiles + runs them at runtime with state, functions, and built-in helpers.

Think CSS + Reactivity + Stdlib → but without needing Tailwind, Sass, or Styled Components.

🚀 Features
✅ Reactive CSS driven by state (cssx.setState({ ... }))

✅ Built-in helpers: px(), rem(), theme(), once(), rand(), darken(), etc.

✅ Framework-agnostic: works in React, Vue, plain JS, anything.

✅ Hot Reload: edit .cssx files → instant update.

✅ SSR-safe design (runtime eval only in browser).

✅ No boilerplate — zero config, just import runtime.

📦 Install
bash
Copy code
npm install cssx
🔧 Usage
1. Create a .cssx file
css
Copy code
/* styles.cssx */
.card {
  background: ${ theme("#111", "#fff") };
  font-size: ${ clamp(14, state.count, 40) }px;
  border: ${ once(() => rand(1, 5)) }px solid blue;
}
2. Load it in your app
js
Copy code
import { cssx } from "cssx-runtime";

cssx.loadFile("/styles.cssx");
cssx.setState({ theme: "dark", count: 10 });
3. Use classes as usual
html
Copy code
<div class="card">Hello CSSX!</div>
🧪 React Demo
jsx
Copy code
import React, { useEffect, useState } from "react";
import { cssx } from "cssx-runtime";

export default function App() {
  const [count, setCount] = useState(10);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    cssx.loadFile("/styles.cssx");
  }, []);

  useEffect(() => {
    cssx.setState({ count, theme });
  }, [count, theme]);

  return (
    <div className="app">
      <div className="counter-box">
        Count: {count}
        <button onClick={() => setCount(count + 1)}>+</button>
        <button onClick={() => setCount(count - 1)}>-</button>
      </div>
      <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
        Toggle Theme
      </button>
    </div>
  );
}
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