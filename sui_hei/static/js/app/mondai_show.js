require([
  "marked",
  "jquery",
  "./common",
  "./sidebar",
  "./mondai_show_ui.js",
  "velocity-animate"
], function(marked, $, common, sidebar, mondaiShowUI) {
  $(document).ready(function() {
    // Previews
    var PageURL = window.location.pathname;
    var path = PageURL.split("/");
    var mondai_id = path[path.length - 1];

    if ($(".mondai_content_content").length > 0) {
      $(".mondai_content_content").html(
        common.LinkNorm(marked($(".mondai_content_content").html()))
      );
    }
    if ($(".mondai_kaisetu_content").length > 0) {
      $(".mondai_kaisetu_content").html(
        common.LinkNorm(marked($(".mondai_kaisetu_content").html()))
      );
    }

    if ($("#kaisetu_textarea").length > 0) {
      $("#kaisetu_preview").html(
        common.LinkNorm(marked($("#kaisetu_textarea").val()))
      );
    }

    $("#kaisetu_textarea").on("input", function() {
      $("#kaisetu_preview").html(
        common.LinkNorm(marked($("#kaisetu_textarea").val()))
      );
    });

    $("#memo_textarea").on("input", function() {
      $("#memo_preview").html(
        common.LinkNorm(marked($("#memo_textarea").val()))
      );
    });

    // handling chat://
    common.LinkNormAll(".memobar_content");

    // qna_edit
    $(".qna_edit").each(function() {
      var csrftoken = $("[name=csrfmiddlewaretoken]").val();
      var pk = $(this).attr("value");
      var target = $(this).attr("target");
      $(this).on("click", function() {
        $.post(
          common.urls.mondai_edit_api,
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
        key2del = memoHashObjKeys.pop();
        delete memoHashObj[key2del];
      }
      // updates cookie
      common.setCookie("memo", JSON.stringify(memoHashObj), 2);
    }

    // initialize UI
    $("#change_seikai_ckbx").on("click", function(e) {
      if (this.checked) {
        bootbox.confirm(
          `<h3>${gettext("Warning")}</h3>` +
            `<p>${gettext(
              "You cannot revert change if you put the true answer!"
            )}</p><p>${gettext("Continue?")}</p>`,
          function(conf) {
            if (!conf) {
              $("#change_seikai_ckbx").prop("checked", false);
            }
          }
        );
      }
    });
    $("#comment_submit").on("click", function() {
      var csrftoken = $("[name=csrfmiddlewaretoken]").val();
      var commentmsg = $("#comment_input").val();
      if (commentmsg) {
        $.post(
          common.urls["mondai_comment"],
          {
            csrfmiddlewaretoken: csrftoken,
            mondai_id: mondai_id,
            content: commentmsg
          },
          function(data) {
            $("#evaluation_panel").html("");
            update_comments();
            $(".mondai_content_comments").velocity("scroll");
          }
        );
      }
    });
    $("#starbutton").on("click", function() {
      $.post(
        common.urls["mondai_star"],
        {
          csrfmiddlewaretoken: $("[name=csrfmiddlewaretoken]").val(),
          stars: $("#starbar").val(),
          mondai: mondai_id
        },
        function(data) {
          if (data) {
            bootbox.alert(
              `<h3>Thanks!</h3><p>${gettext("Thank you for your voting!")}</p>`
            );
          }
        }
      );
    });

    common.bindEnterToSubmit("#comment_input", "#comment_submit");

    function update_comments() {
      $.post(
        common.urls.comment_api,
        {
          csrfmiddlewaretoken: $("[name=csrfmiddlewaretoken]").val(),
          filter: JSON.stringify({ mondai_id: mondai_id })
        },
        function(data) {
          var commentstr = String();
          data.data.forEach(function(comment) {
            commentstr += "<div class='well' style='background:#e2d6b2;'>";
            commentstr += `<div>${comment.content}</div>`;
            commentstr += `<div class="pull-right">——<a style="color:#333" 
            href="${common.urls.profile(comment.user_id.id)}">
              ${comment.user_id.nickname} </a>
            </div>`;
            commentstr += "</div>";
          });
          $(".mondai_content_comments").html(commentstr);
        }
      );
    }

    update_comments();

    mondaiShowUI.initUI();
  });
});
