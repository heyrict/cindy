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
    // Set mode on load
    var $leftbar = $(".leftbar");
    //$(".leftbar").css("height",window.outerHeight+"px");
    $(".leftbar_content").css("height",window.outerHeight-120+"px");
    //$(".leftbar_content").css("width",window.outerHeight-120+"px");

    var $leftbarbtn = $(".leftbar_button");
    resize_rate = $leftbarbtn.height() / (window.innerHeight*0.45);
    $leftbarbtn.attr("style", "height:"+$leftbarbtn.height()/resize_rate+"px;"+
        "width:"+$leftbarbtn.width()/resize_rate+"px;");

    if (getUrlParameter("mode") == "open") {
      $leftbar.style.left="0%";
      $leftbar.attr("mode", "open");
      console.log("OPEN");
    } else $leftbar.attr("left", "0%");

    // Toggle leftbar
    $(".leftbar_button").on("click", function() {
      var $this = $(".leftbar");

      if ($this.attr("mode") == "closed") {
        $this.velocity({
          left: "0%",
          width: window.innerWidth * 0.5,
        });
        $this.attr("mode", "open");
      } else if ($this.attr("mode") == "open") {
        $(".leftbar").velocity({
          left: "-90px",
          width: "100px",
        });
        $this.attr("mode", "closed");
      }
    });
  });
});
