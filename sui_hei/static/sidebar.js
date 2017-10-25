var getUrlParameter = function getUrlParameter(sParam) {
  var sPageURL = decodeURIComponent(window.location.search.substring(1)),
    sURLVariables = sPageURL.split("&"),
    sParameterName,
    i;

  for (i = 0; i < sURLVariables.length; i++) {
    sParameterName = sURLVariables[i].split("=");

    if (sParameterName[0] === sParam) {
      return sParameterName[1] === undefined ? true : sParameterName[1];
    }
  }
};

define(["jquery"], function($) {
  $(document).ready(function() {
    ToggleSidebar();
  });
  function ToggleSidebar() {
    // Set mode on load
    var $leftbar = $(".leftbar");

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

    $(".leftbar_content").css("height", goodh + "px");
    var $leftbarbtn = $(".leftbar_button");
    resize_rate = $leftbarbtn.height() / (window.innerHeight * 0.45);
    $leftbarbtn
      .css("height", $leftbarbtn.height() / resize_rate + "px")
      .css("width", $leftbarbtn.width() / resize_rate + "px");

    $(".memobar_content").css("height", goodh + "px");
    var $memobarbtn = $(".memobar_button");
    resize_rate = $memobarbtn.height() / (window.innerHeight * 0.45);
    $memobarbtn
      .css("height", $memobarbtn.height() / resize_rate + "px")
      .css("width", $memobarbtn.width() / resize_rate + "px");

    // Toggle sidebar
    $(".leftbar_button").on("click", function() {
      var $this = $(".leftbar");

      if ($this.attr("mode") == "closed") {
        $this.velocity({
          left: "0%",
          width: goodw + "px"
        });
        $this.attr("mode", "open");

        if (small_screen) {
          $(".rightbar").velocity({
            left: windoww + goodw + "px"
          });
          $(".rightbar").attr("mode", "closed");
        }
      } else if ($this.attr("mode") == "open") {
        $(".leftbar").velocity({
          left: -goodw * 0.792 + "px",
          width: goodw + "px"
        });
        $this.attr("mode", "closed");

        if (small_screen) {
          $(".rightbar").velocity({
            left: windoww - 18 + "px"
          });
          $(".rightbar").attr("mode", "closed");
        }
      }
    });

    $(".rightbar_button").on("click", function() {
      var $this = $(".rightbar");

      if ($this.attr("mode") == "closed") {
        $this.velocity({
          left: windoww - goodw * 0.792 + "px",
          width: goodw + "px"
        });
        $this.attr("mode", "open");

        if (small_screen) {
          $(".leftbar").velocity({
            left: -goodw + "px"
          });
          $(".leftbar").attr("mode", "closed");
        }
      } else if ($this.attr("mode") == "open") {
        $(".rightbar").velocity({
          left: windoww - 18 + "px",
          width: goodw + "px"
        });
        $this.attr("mode", "closed");

        if (small_screen) {
          $(".leftbar").velocity({
            left: -goodw * 0.792 + "px",
            width: goodw + "px"
          });
          $(".leftbar").attr("mode", "closed");
        }
      }
    });
  }
});

function ChangeChannel() {
  jQuery.get(
    "/lobby/channel",
    { channel: jQuery("#lobby_nav_input").val() },
    function(data) {
      jQuery(".leftbar_content").html(data);
    }
  );
  return false;
}

function PostChat() {
  jQuery.post(
    "/lobby/chat",
    {
      channel: jQuery("#channel").val(),
      push_chat: jQuery("#lobby_chat_input").val()
    },
    function(data) {
      jQuery(".leftbar_content").html(data);
    }
  );
  return false;
}

function InputNorm() {
  var lc = jQuery("#lobby_nav_input");
  lc.val(lc.val().replace(/[^0-9a-zA-Z]+/g, "-"));
}

function PrevChatPage() {
  jQuery.get(
    "/lobby/channel",
    {
      chatpage: jQuery("#lobby_nav_prev").val(),
      channel: jQuery("#channel").val()
    },
    function(data) {
      jQuery(".leftbar_content").html(data);
    }
  );
}

function NextChatPage() {
  jQuery.get(
    "/lobby/channel",
    {
      chatpage: jQuery("#lobby_nav_next").val(),
      channel: jQuery("#channel").val()
    },
    function(data) {
      jQuery(".leftbar_content").html(data);
    }
  );
}

function OpenChat(channel) {
  var $this = $(".leftbar");

  jQuery.get("/lobby/channel", { channel: channel }, function(data) {
    jQuery(".leftbar_content").html(data);
  });

  if ($this.attr("mode") == "closed") {
    $this.velocity({
      left: "0%",
      width: goodw + "px"
    });
    if (small_screen) {
      $(".rightbar").velocity({
        left: windoww + goodw + "px"
      });
      $(".rightbar").attr("mode", "closed");
    }
  }
}
