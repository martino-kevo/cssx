import React, { useEffect, useState } from "react";
import { cssx } from "./cssx-runtime"; // our engine

export default function App() {
  const [theme, setTheme] = useState("light");
  const [count, setCount] = useState(10);

  useEffect(() => {
    // load CSSX file once
    cssx.loadFile("/styles.cssx");
  }, []);

  useEffect(() => {
    // keep CSSX state synced with React state
    cssx.setState({ theme, count });
  }, [theme, count]);

  return (
    <div className="app">
      <h1>⚡ CSSX Live Demo</h1>

      <div className="counter-box">
        <p>Count: <b>{count}</b></p>
        <button onClick={() => setCount(count + 1)}>➕ Increase</button>
        <button onClick={() => setCount(count - 1)}>➖ Decrease</button>
      </div>

      <br />

      <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
        Toggle Theme ({theme})
      </button>
    </div>
  );
}
