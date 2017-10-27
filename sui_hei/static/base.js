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

  $(".chat_message").each(function(index) {
      $(this).html($(this).html().replace(/\"chat:\/\/([0-9a-zA-Z\-]+)\"/g, "\"javascript:OpenChat('$1');\""));
  });
});
