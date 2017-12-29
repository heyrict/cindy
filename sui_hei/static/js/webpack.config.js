var webpack = require("webpack");
var CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");
var ContextReplacementPlugin = require("webpack/lib/ContextReplacementPlugin");
var BundleTracker = require("webpack-bundle-tracker");

module.exports = {
  entry: {
    vendor: [
      "jquery",
      "sanitize-html",
      "markdown-it",
      "bootstrap",
      "bootbox",
      "bootstrap-slider",
      "moment",
      "moment-countdown",
      "./app/common",
      "react",
      "react-dom",
      "react-bootstrap",
      "react-burger-menu",
      "react-relay",
      "react-redux",
      "react-router-dom",
      "react-router-bootstrap"
    ],
    index: "./app/index.jsx"
  },
  output: {
    publicPath: "/static/js/",
    filename: "dist/[name]-[hash].js"
  },
  module: {
    loaders: [],
    rules: [
      // babel
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/react", "@babel/stage-2"],
            plugins: ["relay"]
          }
        }
      },
      // jquery
      {
        test: require.resolve("jquery"),
        use: [
          {
            loader: "expose-loader",
            options: "$"
          },
          {
            loader: "expose-loader",
            options: "jQuery"
          }
        ]
      },
      // bootbox
      {
        test: require.resolve("bootbox"),
        use: [
          {
            loader: "expose-loader",
            options: "bootbox"
          }
        ]
      },
      // velocity
      {
        test: require.resolve("velocity-animate"),
        use: [
          {
            loader: "expose-loader",
            options: "Velocity"
          }
        ]
      },
      // moment
      {
        test: require.resolve("moment"),
        use: [
          {
            loader: "expose-loader",
            options: "moment"
          }
        ]
      }
    ]
  },
  plugins: [
    new CommonsChunkPlugin({
      names: "vendor",
      filename: "dist/[name]-[hash].chunk.js",
      minChunks: Infinity
    }),
    new CommonsChunkPlugin({
      name: "manifest"
    }),
    new ContextReplacementPlugin(/moment[\/\\]locale$/, /fr|zh-cn|ja/),
    new BundleTracker({ filename: "dist/webpack-stats.json" })
  ]
};
