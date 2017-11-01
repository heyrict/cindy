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
      channel = sidebar.GetChannel();
      sidebar.PostChat(channel, $("#lobby_chat_input").val());
    });

    $("#lobby_nav_input").on("input", sidebar.InputNorm);
    $("#lobby_nav_submit").on("click", function(e) {
      channel = $("#lobby_nav_input").val();
      sidebar.OpenChat(channel);
      //return false;
      e.preventDefault();
    });
    $("#lobby_nav_next").on("click", function() {
      chatpage = $(this).val();
      channel = sidebar.GetChannel();
      sidebar.OpenChat(channel, chatpage);
    });
    $("#lobby_nav_prev").on("click", function() {
      chatpage = $(this).val();
      channel = sidebar.GetChannel();
      sidebar.OpenChat(channel, chatpage);
    });

    $(document).ready(function() {
      $(".openchat").each(function(index) {
        $(this).on("click", function() {
          sidebar.OpenChat($(this).val());
        });
      });
    });

    // handling chat://
    sidebar.LinkNormAll("td#message");
  }

  return { init: init };
});
