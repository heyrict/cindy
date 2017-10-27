require(["marked", "jquery"], function(marked, $) {
  $(document).ready(function() {
    $("#kaisetu_preview")[0].innerHTML = marked($("#kaisetu_textarea").val());

    $("#kaisetu_textarea").on("input", function() {
      $("#kaisetu_preview")[0].innerHTML = marked($("#kaisetu_textarea").val());
    });

    $("#memo_textarea").on("input", function() {
      $("#memo_preview")[0].innerHTML = marked($("#memo_textarea").val());
    });
    var PageURL = window.location.pathname;
    $("a.qna_edit").each(function() {
      this.href += "?next=" + PageURL;
    });
  });
});
