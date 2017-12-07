define(["jquery", "./common", "./mondai", "velocity-animate"], function(
  $,
  common,
  mondai
) {
  // Access lobby_api to fetch chat data.
  function load_chat(channel, page) {
    if (channel == "") {
      channel =
        getCurrentChannel() == "lobby"
          ? $("#default_channel").attr("value") || "lobby"
          : "lobby";
    }
    $.post(
      common.urls.lobby_api,
      {
        csrfmiddlewaretoken: $("[name=csrfmiddlewaretoken]").val(),
        order: "-id",
        filter: JSON.stringify({ channel: channel }),
        page: page,
        items_per_page: 10
      },
      function(data) {
        $(".lobby_pagination_div").html(mondai.RenderLobbyPaginator(data));
        $(".lobby_table_div").html(
          common.LinkNorm(mondai.RenderLobbyData(data))
        );
        rebind();
      }
    );
    $("#lobby_nav_input").attr("placeholder", "current channel: " + channel);
  }

  /* Separate initialization function into two functions:
     * rebind() and init(),
     * for that rebind() needs to be executed on DOM update,
     * with changes to #lobby_table_div and #lobby_navigation_div.
     * while init() only needs to be executed once.
     */

  function rebind() {
    // Rebind click event to paginator
    $(".lobby_paginator").on("click", function() {
      chatpage = $(this).attr("value");
      channel = sidebar.GetChannel();
      load_chat(channel, chatpage);
    });

    // Scroll to bottom
    $(".lobby_table_div").velocity("scroll", {
      offset: $(".lobby_table_div").prop("scrollHeight"),
      container: $(".lobby_table_div"),
      duration: 0
    });

    // Make user available to push chat messages.
    lobby_chat_can_submit = true;

    // message_edit
    $(".lobby_message_edit").each(function() {
      var csrftoken = $("[name=csrfmiddlewaretoken]").val();
      var pk = $(this).attr("value");
      var target = $(this).attr("target");
      $(this).on("click", function(e) {
        $.post(
          common.urls.mondai_edit_api,
          { csrfmiddlewaretoken: csrftoken, pk: pk, target: target },
          function(data) {
            $("#message_edit_modal_body").html(
              "<textarea id='message_edit_modal_content'>" +
                data.content +
                "</textarea>"
            );
            $("#message_edit_modal_content").attr("target", target);
            $("#message_edit_modal_content").attr("value", pk);
          }
        );
        e.preventDefault();
      });
    });
  }

  function init() {
    ResizeSidebarContent();

    // buttons & inputs
    lobby_chat_can_submit = true;
    $("#lobby_chat_submit").on("click", function() {
      if (!lobby_chat_can_submit) {
        return false;
      }
      lobby_chat_can_submit = false;
      channel = getCurrentChannel();
      sidebar.PostChat(channel, $("#lobby_chat_input").val(), function() {
        load_chat(channel);
      });
      $("#lobby_chat_input").val("");
    });
    common.bindEnterToSubmit("#lobby_chat_input", "#lobby_chat_submit");

    $("#lobby_nav_input").on("input", sidebar.InputNorm);
    common.bindEnterToSubmit("#lobby_nav_input", "#lobby_nav_submit");

    $("#lobby_nav_submit").on("click", function(e) {
      channel = $("#lobby_nav_input").val();
      load_chat(channel);
      $("#lobby_nav_input").val("");
      e.preventDefault();
    });

    channel = $("#default_channel").attr("value") || "lobby";
    load_chat(channel);
  }

  function getCurrentChannel() {
    channel = $("#lobby_nav_input")
      .attr("placeholder")
      .substr(17);
    return channel;
  }

  function ResizeSidebarContent() {
    // Set Height
    var nav_height = 60;
    var chat_height = 60;
    var table_height = goodh - nav_height - chat_height - 5;
    $(".lobby_navigation_div").velocity({ height: nav_height + "px" });
    $(".lobby_chat_div").velocity({ height: nav_height + "px" });
    $(".lobby_table_div").css("height", table_height + "px");
  }

  function ResizeSidebar() {
    var $leftbar = $(".leftbar");
    var $rightbar = $(".rightbar");
    var $leftbarbtn = $(".leftbar_button");
    var $memobarbtn = $(".memobar_button");

    $leftbar.css("width", goodw + "px");
    if ($leftbar.attr("mode") == "open") {
      $leftbar.css("left", "0%");
    } else if ($leftbar.attr("mode") == "hide") {
      $leftbar.css("left", -goodw + "px");
    } else {
      $leftbar.css("left", -goodw * 0.792 + "px");
      $leftbar.attr("mode", "closed");
    }

    $rightbar.css("width", goodw + "px");
    if ($rightbar.attr("mode") == "open") {
      $rightbar.css("left", windoww - goodw * 0.792 + "px");
    } else if ($rightbar.attr("mode") == "hide") {
      $rightbar.css("left", windoww + goodw + "px");
    } else {
      $rightbar.css("left", windoww + "px");
      $rightbar.attr("mode", "closed");
    }

    $(".leftbar_content").css("height", goodh + "px");
    $(".memobar_content").css("height", goodh + "px");

    resize_rate = $leftbarbtn.height() / (window.innerHeight * 0.35);
    $leftbarbtn
      .css("height", $leftbarbtn.height() / resize_rate + "px")
      .css("width", $leftbarbtn.width() / resize_rate + "px");

    resize_rate = $memobarbtn.height() / (window.innerHeight * 0.35);
    $memobarbtn
      .css("height", $memobarbtn.height() / resize_rate + "px")
      .css("width", $memobarbtn.width() / resize_rate + "px");
  }

  var goodh, goodw, windoww, small_screen;
  function CalcGoodRect() {
    // Calculate best width & height of sidebar
    goodh = window.innerHeight - 20;
    if (goodh < 400) {
      goodh = window.innerHeight;
    }
    windoww = Math.max(window.outerWidth, window.innerWidth);
    goodw = windoww * 0.45;
    small_screen = false;
    if (goodw < 400) {
      goodw = Math.max(window.outerWidth, window.innerWidth);
      small_screen = true;
    }
  }

  function ToggleSidebar() {
    // Toggle sidebar
    $(".leftbar_button").on("click", function() {
      var $leftbar = $(".leftbar");
      var $rightbar = $(".rightbar");

      if ($leftbar.attr("mode") == "closed") {
        $leftbar.velocity({
          left: "0%",
          duration: 1000
        });
        $leftbar.attr("mode", "open");

        if (small_screen) {
          $rightbar.velocity({
            left: windoww + goodw + "px",
            duration: 1000
          });
          $rightbar.attr("mode", "hide");
        }
      } else if ($leftbar.attr("mode") == "open") {
        $(".leftbar").velocity({
          left: -goodw * 0.792 + "px",
          duration: 1000
        });
        $leftbar.attr("mode", "closed");

        if (small_screen) {
          $rightbar.velocity({
            left: windoww + "px",
            duration: 1000
          });
          $rightbar.attr("mode", "closed");
        }
      }
    });
    $(".rightbar_button").on("click", function() {
      var $this = $(".rightbar");

      if ($this.attr("mode") == "closed") {
        $this.velocity({
          left: windoww - goodw * 0.792 + "px",
          duration: 1000
        });
        $this.attr("mode", "open");

        if (small_screen) {
          $(".leftbar").velocity({
            left: -goodw + "px",
            duration: 1000
          });
          $(".leftbar").attr("mode", "hide");
        }
      } else if ($this.attr("mode") == "open") {
        $(".rightbar").velocity({
          left: windoww + "px",
          duration: 1000
        });
        $this.attr("mode", "closed");

        if (small_screen) {
          $(".leftbar").velocity({
            left: -goodw * 0.792 + "px",
            duration: 1000
          });
          $(".leftbar").attr("mode", "closed");
        }
      }
    });
  }

  function PostChat(channel, message, callback) {
    var csrftoken = $("[name=csrfmiddlewaretoken]").val();
    if (!channel.match("^[A-Za-z0-9-]+$")) {
      return false;
    }
    $.post(
      common.urls.lobby_chat,
      {
        csrfmiddlewaretoken: csrftoken,
        channel: channel,
        push_chat: message
      },
      function(data) {
        if (callback) {
          return callback(data);
        } else {
          $(".leftbar_content").html(data);
        }
      }
    );
    return false;
  }

  function InputNorm() {
    var lc = $("#lobby_nav_input");
    lc.val(lc.val().replace(/[^0-9a-zA-Z]+/g, "-"));
  }

  function OpenChat(channel, chatpage) {
    // set default values
    channel = channel || "lobby";
    chatpage = chatpage || 1;

    load_chat(channel, chatpage);

    if ($this.attr("mode") != "open") {
      $this.velocity({
        left: "0%",
        duration: 1000
      });
      $this.attr("mode", "open");
      if (small_screen) {
        $(".rightbar").velocity({
          left: windoww + goodw + "px"
        });
        $(".rightbar").attr("mode", "hide");
      }
    }
  }

  function OpenMemo() {
    var $this = $(".rightbar");

    if ($this.attr("mode") == "closed") {
      $this.velocity({
        left: windoww - goodw * 0.792 + "px",
        duration: 1000
      });
      $this.attr("mode", "open");

      if (small_screen) {
        $(".leftbar").velocity({
          left: -goodw + "px",
          duration: 1000
        });
        $(".leftbar").attr("mode", "hide");
      }
    }
  }

  function CloseMemo() {
    var $this = $(".rightbar");

    if ($this.attr("mode") == "open") {
      $(".rightbar").velocity({
        left: windoww + "px",
        duration: 1000
      });
      $this.attr("mode", "closed");

      if (small_screen) {
        $(".leftbar").velocity({
          left: -goodw * 0.792 + "px",
          duration: 1000
        });
        $(".leftbar").attr("mode", "closed");
      }
    }
  }

  function IsSmallScreen() {
    return small_screen;
  }

  return {
    CalcGoodRect: CalcGoodRect,
    ResizeSidebar: ResizeSidebar,
    ResizeSidebarContent: ResizeSidebarContent,
    ToggleSidebar: ToggleSidebar,
    InputNorm: InputNorm,
    OpenChat: OpenChat,
    OpenMemo: OpenMemo,
    CloseMemo: CloseMemo,
    PostChat: PostChat,
    GetChannel: getCurrentChannel,
    __init__: init,
    IsSmallScreen: IsSmallScreen
  };
});
