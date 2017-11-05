module.exports = {
  entry: {
    common: [ "./app/common"],
    main: ["./app/base", "./app/sidebar", "./app/leftbar_content", "./lib/bootstrap.min"],
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
      // bootstrap
      {
        test: require.resolve("./lib/bootstrap.min.js"),
        use: [
          {
            loader: "expose-loader",
            options: "bootstrap"
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
      // common
      {
        test: require.resolve("./app/common.js"),
        use: [
          {
            loader: "expose-loader",
            options: "common"
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
      }
    ]
  }
};
