require(["marked", "jquery"], function(marked, $) {
  $(document).ready(function() {
    if ($("#kaisetu_textarea").length > 0) {
      $("#kaisetu_preview").html(marked($("#kaisetu_textarea").val()));
    }

    $("#kaisetu_textarea").on("input", function() {
      $("#kaisetu_preview").html(marked($("#kaisetu_textarea").val()));
    });

    $("#memo_textarea").on("input", function() {
      $("#memo_preview").html(marked($("#memo_textarea").val()));
    });
    var PageURL = window.location.pathname;
    $("a.qna_edit").each(function() {
      this.href += "?next=" + PageURL;
    });
  });
});
