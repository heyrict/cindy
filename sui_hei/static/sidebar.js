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
    var goodh = Math.max(window.innerHeight - 20, 400);
    var goodw = Math.max(window.outerWidth * 0.45, 400);
    $(".leftbar_content").css("height", goodh + "px");

    var $leftbarbtn = $(".leftbar_button");
    resize_rate = $leftbarbtn.height() / (window.innerHeight * 0.45);
    $leftbarbtn.attr(
      "style",
      "height:" +
        $leftbarbtn.height() / resize_rate +
        "px;" +
        "width:" +
        $leftbarbtn.width() / resize_rate +
        "px;"
    );

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
    { channel: jQuery("#LobbyChannel").val() },
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
      push_chat: jQuery("#LobbyContent").val()
    },
    function(data) {
      jQuery(".leftbar_content").html(data);
    }
  );
  return false;
}
function InputNorm() {
  var lc = jQuery("#LobbyChannel");
  lc.val(lc.val().replace(/[^0-9a-zA-Z]+/g, "-"));
}
function PrevChatPage() {
  jQuery.get(
    "/lobby/channel",
    { chatpage: jQuery("#lobby_nav_prev").val() },
    function(data) {
      jQuery(".leftbar_content").html(data);
    }
  );
}
function NextChatPage() {
  jQuery.get(
    "/lobby/channel",
    { chatpage: jQuery("#lobby_nav_next").val() },
    function(data) {
      jQuery(".leftbar_content").html(data);
    }
  );
}
