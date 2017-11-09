define(["jquery", "../lib/bootstrap.min.js", "bootstrap-slider"], function($) {
  function initUI() {
    if ($("#starbar").length > 0) {
      var starbarSlider = $("#starbar").bootstrapSlider({
        formatter: function(value) {
          outstr = value;
          for (i = -5; i < value; i += 20) {
            outstr += "☆";
          }
          return outstr;
        }
      });
      function resizeHandle() {
        var handle = $(".slider-handle.custom");
        var prevStar = $("#starbar").val();
        handle.css("width", 20 + prevStar / 8 + "px");
        handle.css("height", 20 + prevStar / 8 + "px");
        handle.css("margin-left", -10 - prevStar / 16 + "px");
        handle.css("top", -prevStar * 0.08 + "px");
      }
      resizeHandle();

      starbarSlider.on("slide", resizeHandle);
    }
  }

  return { initUI: initUI };
});
