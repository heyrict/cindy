require("marked");
require(["jquery", "./sidebar", "../lib/bootstrap.min.js"], function(
  $,
  sidebar
) {
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

  // Edit modal related
  $(document).ready(function() {
    // message_edit modal
    $("#message_edit_modal_save").on("click", function() {
      var csrftoken = $("[name=csrfmiddlewaretoken]").val();
      var pk = $("#message_edit_modal_content").attr("value");
      var content = $("#message_edit_modal_content").val();
      var target = $("#message_edit_modal_content").attr("target");
      var post_link = target == "lobby" ? "/lobby/edit" : "/mondai/edit";
      $.post(
        post_link,
        {
          csrfmiddlewaretoken: csrftoken,
          pk: pk,
          content: content,
          target: target
        },
        function(data) {
          if (data.error_message) {
            alert(data.error_message);
          }
          if (target == "lobby") {
            sidebar.OpenChat(sidebar.GetChannel, 1);
          } else {
            window.location.reload();
          }
        }
      );
    });
  });
});
