import { cssx } from "./runtime/cssx-runtime.js";
// import * as funcs from "./functions.js";

cssx.registerFunctions(funcs);
cssx.setState({ theme: "dark" });
cssx.loadFile("./styles/app.cssx");
// await cssx.loadFile("./styles/app.cssx");

// later...
cssx.setState({ loggedIn: true });
