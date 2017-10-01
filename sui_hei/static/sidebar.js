$(document).ready(function() {
  $(".leftbar_button").on("click", function() {
    var $this = $(".leftbar");

    // Toggle leftbar
    if ($this.attr("mode") == "closed") {
      $this.velocity({
        left: "0%"
      });
      $this.attr("mode", "opened");
    } else if ($this.attr("mode") == "opened") {
      $(".leftbar").velocity({
        left: "-30%"
      });
      $this.attr("mode", "closed");
    }
  });
});
