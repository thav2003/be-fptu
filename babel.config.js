module.exports = {
  presets: ["@babel/preset-env"],
  plugins: [
    "@babel/proposal-class-properties",
    "@babel/plugin-transform-runtime",
    "@babel/plugin-proposal-object-rest-spread",
    "@babel/plugin-transform-async-to-generator",
    "@babel/plugin-syntax-dynamic-import",
  ],
  sourceType: "unambiguous",
};
