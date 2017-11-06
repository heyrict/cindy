define(["jquery", "./sidebar", "velocity-animate"], function($, sidebar) {
  function init() {
    sidebar.ResizeSidebarContent();

    // buttons & inputs
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

      // message_edit
      $(".lobby_message_edit").each(function() {
        var csrftoken = $("[name=csrfmiddlewaretoken]").val();
        var pk = $(this).attr("value");
        var target = $(this).attr("target");
        $(this).on("click", function() {
          $.post(
            "/api/mondai_edit",
            { csrfmiddlewaretoken: csrftoken, pk: pk, target: target },
            function(data) {
              $("#message_edit_modal_body").html(
                `<textarea id="message_edit_modal_content">${data.content}</textarea>`
              );
              $("#message_edit_modal_content").attr("target", target);
              $("#message_edit_modal_content").attr("value", pk);
            }
          );
        });
      });
    });

    // handling chat://
    sidebar.LinkNormAll("td.lobby_message");
  }

  return { init: init };
});
