module.exports = {
  entry: {
    common: [ "./app/common.js"],
    main: ["./app/base.js", "./app/sidebar.js", "./app/leftbar_content.js"],
    mondai_show: ["./app/mondai_show.js", "./app/mondai_show_ui.js"]
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
      }
    ]
  }
};
