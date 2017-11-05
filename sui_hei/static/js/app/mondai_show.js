require(["marked", "jquery", "./common", "./sidebar"], function(
  marked,
  $,
  common,
  sidebar
) {
  $(document).ready(function() {
    // Previews
    if ($("#kaisetu_textarea").length > 0) {
      $("#kaisetu_preview").html(marked($("#kaisetu_textarea").val()));
    }

    $("#kaisetu_textarea").on("input", function() {
      $("#kaisetu_preview").html(marked($("#kaisetu_textarea").val()));
    });

    $("#memo_textarea").on("input", function() {
      $("#memo_preview").html(marked($("#memo_textarea").val()));
    });

    // add redirect link to [edit]
    var PageURL = window.location.pathname;
    $("a.qna_edit").each(function() {
      this.href += "?next=" + PageURL;
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
