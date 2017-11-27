require(["jquery", "./common"], function($, common, marked) {
  $(document).ready(function() {
    $("#content_preview")[0].innerHTML = common.text2md($("#id_content").val());
    $("#kaisetu_preview")[0].innerHTML = common.text2md($("#id_kaisetu").val());

    $("#id_content").on("input", function() {
      $("#content_preview")[0].innerHTML = common.text2md(
        $("#id_content").val()
      );
    });

    $("#id_kaisetu").on("input", function() {
      $("#kaisetu_preview")[0].innerHTML = common.text2md(
        $("#id_kaisetu").val()
      );
    });
  });
});
