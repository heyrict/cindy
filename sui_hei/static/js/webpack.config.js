var webpack = require("webpack");
var CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");

module.exports = {
  entry: {
    index: ["./app/index"],
    main: ["./app/base", "./app/sidebar"],
    vendor: [
      "jquery",
      "velocity-animate",
      "marked",
      "./lib/bootstrap.min.js",
      "bootbox",
      "bootstrap-slider",
      "moment",
      "moment-countdown"
    ],
    leftbar: "./app/leftbar_content",
    profile_mystar: ["./app/profile_mystar"],
    profile: ["./app/profile"],
    mondai: ["./app/mondai_list"],
    mondai_add: ["./app/mondai_add"],
    mondai_show: "./app/mondai_show"
  },
  output: {
    publicPath: "/static/js/",
    filename: "dist/[name].js"
  },
  module: {
    loaders: [],
    rules: [
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
      // marked
      {
        test: require.resolve("marked"),
        use: [
          {
            loader: "expose-loader",
            options: "marked"
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
      },
    ]
  },
  plugins: [
    new CommonsChunkPlugin({
      name: "vendor",
      filename: "dist/vendor.chunk.js",
      minChunks: Infinity
    })
  ]
};
