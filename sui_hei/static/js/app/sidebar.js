define(["jquery", "velocity-animate"], function($) {
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

    $("#lobby_chat_input").on("keypress", function(e) {
      if (e.which == 13) {
        $("#lobby_chat_submit").click();
      }
    });

    $("#lobby_nav_input").on("keypress", function(e) {
      if (e.which == 13) {
        $("#lobby_nav_submit").click();
      }
    });

    $(".lobby_table_div").velocity("scroll", {
      offset: $(".lobby_table_div").prop("scrollHeight"),
      container: $(".lobby_table_div"),
      duration: 0
    });
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

    resize_rate = $leftbarbtn.height() / (window.innerHeight * 0.45);
    $leftbarbtn
      .css("height", $leftbarbtn.height() / resize_rate + "px")
      .css("width", $leftbarbtn.width() / resize_rate + "px");

    resize_rate = $memobarbtn.height() / (window.innerHeight * 0.45);
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
      "/lobby/chat",
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

    var $this = $(".leftbar");

    $.get("/lobby/channel", { channel: channel, chatpage: chatpage }, function(
      data
    ) {
      $(".leftbar_content").html(data);
    });

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

  function LinkNorm(string) {
    return string.replace(
      /\"chat:\/\/([0-9a-zA-Z\-]+)\"/g,
      "\"javascript:sidebar.OpenChat('$1');\""
    );
  }

  function LinkNormAll(selector) {
    if ($(selector).length > 0) {
      $(selector).each(function(index) {
        $(this).html(LinkNorm($(this).html()));
      });
    }
  }

  return {
    CalcGoodRect: CalcGoodRect,
    ResizeSidebar: ResizeSidebar,
    ResizeSidebarContent: ResizeSidebarContent,
    ToggleSidebar: ToggleSidebar,
    InputNorm: InputNorm,
    LinkNorm: LinkNorm,
    LinkNormAll: LinkNormAll,
    OpenChat: OpenChat,
    OpenMemo: OpenMemo,
    PostChat: PostChat,
    GetChannel: getCurrentChannel
  };
});
