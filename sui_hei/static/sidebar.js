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

$(document).ready(function() {
  // Set mode on load
  var $leftbar = $(".leftbar");
  if (getUrlParameter("mode") == "open") {
    $leftbar.attr("style", "left:0%");
    $leftbar.attr("mode", "open");
    console.log("OPEN");
  } else $leftbar.attr("left", "0%");

  // Toggle leftbar
  $(".leftbar_button").on("click", function() {
    var $this = $(".leftbar");

    if ($this.attr("mode") == "closed") {
      $this.velocity({
        left: "0%"
      });
      $this.attr("mode", "open");
    } else if ($this.attr("mode") == "open") {
      $(".leftbar").velocity({
        left: "-30.3%"
      });
      $this.attr("mode", "closed");
    }
  });
});
