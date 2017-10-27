requirejs.config({
  base_url: "/static",
  paths: {
    jquery: "jquery.min",
    marked: "marked.min"
  }
});

require(["jquery"], function($) {
  can_submit = {};
  $("form").each(function(index) {
    can_submit[index] = true;
    $(this).on("submit", function() {
      if (!can_submit[index]) {
        return false;
      }
      can_submit[index] = false;
      return true;
    });
  });
});
