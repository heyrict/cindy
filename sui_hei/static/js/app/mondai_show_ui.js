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
  function initUI(prevStar) {
    $("#starbar").bootstrapSlider({
      formatter: function(value) {
        return value;
      }
    });
  }

  return { initUI: initUI };
});
