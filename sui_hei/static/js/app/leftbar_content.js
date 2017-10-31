define(["jquery", "./sidebar", "velocity-animate"], function($, sidebar) {
  function init() {
    sidebar.ResizeSidebarContent();
    // Set redirection url for `edit`
    var PageURL = window.location.pathname;
    $("a.chat_edit").each(function() {
      this.href += "?next=" + PageURL;
    });

    lobby_chat_can_submit = true;
    $("#lobby_chat_submit").on("click", function() {
      if (!lobby_chat_can_submit) {
        return false;
      }
      lobby_chat_can_submit = false;
      channel = $("#lobby_nav_input")
        .attr("placeholder")
        .substr(17);
      sidebar.PostChat(channel, $("#lobby_chat_input").val());
    });

    $("#lobby_nav_input").on("input", function() {
      sidebar.InputNorm();
    });
    $("#lobby_nav_submit").on("click", function() {
      return sidebar.ChangeChannel();
    });
    $("#lobby_nav_next").on("click", function() {
      sidebar.NextChatPage();
    });
    $("#lobby_nav_prev").on("click", function() {
      sidebar.PrevChatPage();
    });

    $(document).ready(function() {
      $(".openchat").each(function(index) {
        $(this).on("click", function() {
          sidebar.OpenChat($(this).val());
        });
      });
    });

    // handling chat://
    $("td#message").each(function(index) {
      $(this).html(
        $(this)
          .html()
          .replace(
            /\"chat:\/\/([0-9a-zA-Z\-]+)\"/g,
            "\"javascript:sidebar.OpenChat('$1');void(0);\""
          )
      );
    });
  }

  return {init: init};
});
