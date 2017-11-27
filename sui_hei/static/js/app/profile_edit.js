require(["jquery", "./common"], function($, common) {
  $(document).ready(function() {
    var inputs = $("#id_profile").val();
    inputs = common.text2md(inputs);
    $("#profile_preview")[0].innerHTML = inputs;

    $("#id_profile").on("input", function() {
      var inputs = $("#id_profile").val();
      inputs = common.text2md(inputs);
      $("#profile_preview")[0].innerHTML = inputs;
    });
  });
});
