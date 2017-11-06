require(["marked", "jquery", "./common", "./sidebar"], function(
  marked,
  $,
  common,
  sidebar
) {
  $(document).ready(function() {
    // Previews
    var PageURL = window.location.pathname;
    if ($("#kaisetu_textarea").length > 0) {
      $("#kaisetu_preview").html(marked($("#kaisetu_textarea").val()));
    }

    $("#kaisetu_textarea").on("input", function() {
      $("#kaisetu_preview").html(marked($("#kaisetu_textarea").val()));
    });

    $("#memo_textarea").on("input", function() {
      $("#memo_preview").html(marked($("#memo_textarea").val()));
    });

    // qna_edit
    $(".qna_edit").each(function() {
      var csrftoken = $("[name=csrfmiddlewaretoken]").val();
      var pk = $(this).attr("value");
      var target = $(this).attr("target");
      $(this).on("click", function() {
        $.post(
          "/mondai/edit",
          { csrfmiddlewaretoken: csrftoken, pk: pk, target: target },
          function(data) {
            $("#message_edit_modal_body").html(
              `<textarea id="message_edit_modal_content">${data.content}</textarea>`
            );
            $("#message_edit_modal_content").attr("target", target);
            $("#message_edit_modal_content").attr("value", pk);
          }
        );
      });
    });

    // if memo updates, open memo bar
    var $memo = $(".memobar_content");
    if ($memo.length > 0) {
      var path = PageURL.split("/");
      var mondai_id = path[path.length - 1];
      var memoHash = common.hash($memo.html());
      var memoCookie = common.getCookie("memo");
      var memoHashObj = memoCookie ? JSON.parse(memoCookie) : {};
      if (memoHashObj[mondai_id] != memoHash) {
        sidebar.CalcGoodRect();
        sidebar.OpenMemo();
        memoHashObj[mondai_id] = common.hash($memo.html());
      }
      // clean the object list
      memoHashObjKeys = Object.keys(memoHashObj).reverse();
      while (memoHashObjKeys.length > 20) {
        key2del = memoHashObj.Keys.pop();
        delete memoHashObj[key2del];
      }
      // updates cookie
      common.setCookie("memo", JSON.stringify(memoHashObj), 2);
    }
  });
});
