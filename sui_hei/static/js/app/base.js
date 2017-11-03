require("marked");
require("../lib/bootstrap.min.js");
require(["jquery", "./sidebar"], function($, sidebar) {
  $(document).ready(function() {
    // Prevent multiple form submission
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

    // Replace chat://
    $(".chat_message").each(function(index) {
      $(this).html(
        $(this)
          .html()
          .replace(
            /\"chat:\/\/([0-9a-zA-Z\-]+)\"/g,
            "\"javascript:sidebar.OpenChat('$1');\""
          )
      );
    });
  });

  // Sidebar related
  $(document).ready(function() {
    sidebar.ToggleSidebar();
  });

  $(window).on("load", function() {
    //Calculate the good width&height, resize, with toggle event handles
    sidebar.CalcGoodRect();
    sidebar.ResizeSidebar();
    sidebar.ResizeSidebarContent();
  });

  $(window).on("resize", function() {
    // Recalculate the good width/height and resize
    sidebar.CalcGoodRect();
    sidebar.ResizeSidebar();
    sidebar.ResizeSidebarContent();
  });
});
