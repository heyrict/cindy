requirejs.config({
  baseURL: "/static",
  paths: {
    jquery: [
      "https://cdn.bootcss.com/jquery/3.2.1/jquery.min",
      "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min",
    ],
    velocity: [
      "https://cdn.bootcss.com/velocity/1.5.0/velocity.min",
      "https://cdnjs.cloudflare.com/ajax/libs/velocity/1.5.0/velocity.min",
    ],
    marked: [
      "https://cdn.bootcss.com/marked/0.3.6/marked.min",
      "https://cdnjs.cloudflare.com/ajax/libs/marked/0.3.6/marked.min",
    ],
    "jquery-ui": [
      "https://cdn.bootcss.com/jqueryui/1.12.1/jquery-ui.js",
      "https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min",
    ]
  },
  shim: {
    "jquery-ui": ["jquery"],
    velocity: ["jquery"],
    sidebar: ["velocity", "jquery"],
    mondai_show: ["jquery", "marked"]
  }
});
