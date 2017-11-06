var webpack = require("webpack");
var CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");

module.exports = {
  entry: {
    common: ["./app/common"],
    index: ["./app/index"],
    main: [
      "jquery",
      "./lib/bootstrap.min.js",
      "./app/base",
      "./app/sidebar",
      "./app/leftbar_content"
    ],
    profile_mystar: ["./app/profile_mystar"],
    mondai: ["./app/mondai"],
    mondai_show: ["./app/mondai_show", "./app/mondai_show_ui"]
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
      // mondai_show
      {
        test: require.resolve("./app/mondai_show_ui"),
        use: [
          {
            loader: "expose-loader",
            options: "mondaiShowUI"
          }
        ]
      },
    ]
  },
  plugins: [
    new CommonsChunkPlugin("commons.chunk")
  ]
};
