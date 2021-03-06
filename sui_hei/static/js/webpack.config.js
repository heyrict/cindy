var webpack = require("webpack");
var CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");
var ContextReplacementPlugin = require("webpack/lib/ContextReplacementPlugin");
var BundleTracker = require("webpack-bundle-tracker");

module.exports = {
  entry: {
    index: ["./app/index"],
    main: ["./app/base", "./app/sidebar"],
    vendor: [
      "jquery",
      "sanitize-html",
      "velocity-animate",
      "markdown-it",
      "bootstrap",
      "bootbox",
      "bootstrap-slider",
      "moment",
      "moment-countdown",
      "./app/common"
    ],
    leftbar: "./app/leftbar_content",
    profile: ["./app/profile"],
    profile_edit: ["./app/profile_edit"],
    profile_list: ["./app/profile_list"],
    mondai: ["./app/mondai_list"],
    mondai_add: ["./app/mondai_add"],
    mondai_show: "./app/mondai_show"
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
            presets: ["@babel/preset-env", "@babel/react"]
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
      },
      // sidebar
      {
        test: require.resolve("./app/sidebar"),
        use: [
          {
            loader: "expose-loader",
            options: "sidebar"
          }
        ]
      },
      {
        test: require.resolve("./app/leftbar_content"),
        use: [
          {
            loader: "expose-loader",
            options: "leftbar"
          }
        ]
      }
    ]
  },
  plugins: [
    new CommonsChunkPlugin({
      name: "vendor",
      filename: "dist/[name]-[hash].chunk.js",
      minChunks: Infinity
    }),
    new CommonsChunkPlugin({
      name: "manifest"
    }),
    new ContextReplacementPlugin(/moment[\/\\]locale$/, /fr|zh-cn|ja/),
    new BundleTracker({filename: "dist/webpack-stats.json"})
  ]
};
