
function ShowComments() {
  var $this = $(".leftbar");
  var goodh = Math.max(window.innerHeight - 20, 400);
  var goodw = Math.max(window.outerWidth * 0.45, 400);

  // switch channel
  jQuery.get(
    "/lobby/channel",
    { channel: jQuery("#show_comments").attr('channel') },
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
