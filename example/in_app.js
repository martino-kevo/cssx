// 🌐 In App (React, Vue, Svelte, etc.)

import { cssx } from "./runtime/cssx-runtime.js";
import { cssxFunctions } from "./user/functions.js";

cssx.registerFunctions(cssxFunctions);

// 🚀 Just point to the .cssx file
await cssx.loadFile("./styles/page.cssx");

// Set initial state
cssx.setState({ loggedIn: true });

// Flip state later
setTimeout(() => cssx.setState({ loggedIn: false }), 3000);
