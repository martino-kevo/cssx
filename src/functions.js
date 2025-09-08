// all registered CSSX functions (user preference)

// Example user-defined CSSX functions
// build/cssx.functions.js
module.exports = {
  love: () => "#e84393",
  hate: () => "#636e72",
  rand: (min = 0, max = 10) => Math.floor(Math.random() * (max - min + 1)) + min,
  // Add constants or helper utilities used at build-time
  scale: 1.2,
};

// You can add more functions as needed