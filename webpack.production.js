const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
	entry: {
		app: "./src/index.ts",
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: "ts-loader",
				exclude: "/node_modules/",
			},
		],
	},
	resolve: {
		extensions: [".tsx", ".ts", ".js"],
	},
	output: {
		filename: "index.js",
		path: path.resolve(__dirname, "dist"),
	},
	mode: "production",
	plugins: [
		new HtmlWebpackPlugin({
			template: "./src/index.ejs",
		}),
		new CopyWebpackPlugin({
			patterns: [
				{
					from: "./src/assets",
					to: "./assets",
				},
			],
		}),
	],
};
