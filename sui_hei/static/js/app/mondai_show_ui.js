define(["jquery", "../lib/bootstrap-slider.min.js"], function($) {
  /*
  function initUI(prevStar) {
    var handle = $("#starbar_handle");
    $("#starbar").slider({
      max: 5,
      min: -5,
      step: 0.01,
      value: prevStar,
      create: function(event, ui) {
        handle.css("width", 30 + 2 * prevStar + "px");
        handle.css("height", 30 + 2 * prevStar + "px");
        handle.css("margin-top", -7.5 - prevStar + "px");
      },
      slide: function(event, ui) {
        handle.css("width", 30 + 2 * ui.value + "px");
        handle.css("height", 30 + 2 * ui.value + "px");
        handle.css("margin-top", -7.5 - ui.value + "px");
      }
    });
  }
  */
  function initUI() {
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

  return { initUI: initUI };
});
