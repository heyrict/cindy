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
    var goodh = window.innerHeight - 20;
    if (goodh < 400) {
      goodh = window.innerHeight;
    }
    var goodw = Math.max(window.outerWidth, window.innerWidth) * 0.45;
    if (goodw < 400) {
      goodw = Math.max(window.outerWidth, window.innerWidth);
    }
    $(".leftbar_content").css("height", goodh + "px");

    // Toggle leftbar
    $(".leftbar_button").on("click", function() {
      var $this = $(".leftbar");

      if ($this.attr("mode") == "closed") {
        $this.velocity({
          left: "0%",
          width: goodw + "px"
        });
        $this.attr("mode", "open");
      } else if ($this.attr("mode") == "open") {
        $(".leftbar").velocity({
          left: -goodw * 0.792 + "px",
          width: goodw + "px"
        });
        $this.attr("mode", "closed");
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
  var goodh = Math.max(window.innerHeight - 20, 400);
  var goodw = Math.max(window.outerWidth * 0.45, 400);

  jQuery.get(
    "/lobby/channel",
    { channel: channel },
    function(data) {
      jQuery(".leftbar_content").html(data);
    }
  );

  if ($this.attr("mode") == "closed") {
    $this.velocity({
      left: "0%",
      width: goodw + "px"
    });
    $this.attr("mode", "open");
  }
}
