/*global module */
const Dotenv = require("dotenv-webpack");
const Path = require("path");

module.exports = {
  plugins: [new Dotenv()],
  entry: {
    mage: "./source/mage.ts",
    paladin: "./source/paladin.ts",
    rogue: "./source/rogue.ts",
    warrior: "./source/warrior.ts",
    // priest: "./source/priest.ts",
    // merchant: "./source/merchant.ts",
    // hardcore: "./source/hardcore.ts"
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  optimization: {
    minimize: true,
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "[name].js",
    path: Path.resolve(__dirname, "build"),
    library: "bots",
    libraryTarget: "window",
  },
};
