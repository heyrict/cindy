require([
  "jquery",
  "./common",
  "./mondai",
  "./sidebar",
  "sanitize-html",
  "../lib/bootstrap.min.js",
  "bootstrap-slider",
  "velocity-animate"
], function($, common, mondai, sidebar, sanitizeHtml) {
  $(document).ready(function() {
    // Previews
    var PageURL = window.location.pathname,
      path = PageURL.split("/"),
      mondai_id = path[path.length - 1],
      mondai_status,
      mondai_giver_id,
      mondai_yami,
      memo_hash;
    set_default_channel();

    // render the whole page
    $.post(
      common.urls.mondai_show_api,
      {
        csrfmiddlewaretoken: $("[name=csrfmiddlewaretoken]").val(),
        id: mondai_id
      },
      function(data) {
        mondai_status = data.data.status;
        mondai_giver_id = data.data.user_id.id;
        mondai_yami = data.data.yami;
        toggle_form_visibility(data.data);
        update_comments();
        update_mondai_kaisetu(data.data);
      }
    );

    function update_mondai_memo(data) {
      if (data.memo) {
        $(".memobar").removeClass("hidden");
        $(".mondai_memo").html(common.text2md(data.memo));
        on_memobar_update();
      } else {
        $(".memobar").addClass("hidden");
      }
    }

    function update_mondai_kaisetu(data) {
      function _update_kaisetu_with_data(data) {
        mondai_status = data.status;
        toggle_form_visibility(data);
        fill_data_in_giver_panel(data);
        update_mondai_qna(data);
        update_mondai_memo(data);
        $(".mondai_title").html(mondai.RenderMondaiTitle(data));
        $(".mondai_content_header").html(
          mondai.RenderMondaiContentHeader(data)
        );
        $(".mondai_content_content").html(
          mondai.RenderMondaiContentContent(data)
        );
        $("#page_title").html(
          "Cindy - " +
            sanitizeHtml(mondai.RenderMondaiTitle(data), {
              allowedTags: []
            })
        );

        if (data.status == 1 || data.status == 2) {
          init_evaluation_panel();
          $(".mondai_kaisetu").removeClass("hidden");
          $(".mondai_kaisetu_content").html(common.text2md(data.kaisetu));
        } else {
          $(".mondai_kaisetu").addClass("hidden");
          $(".mondai_kaisetu_content").html("");
        }
      }
      if (data) {
        _update_kaisetu_with_data(data);
      } else {
        $.post(
          common.urls.mondai_show_api,
          {
            csrfmiddlewaretoken: $("[name=csrfmiddlewaretoken]").val(),
            id: mondai_id
          },
          d => _update_kaisetu_with_data(d.data)
        );
      }
    }

    function update_mondai_qna(data) {
      if (mondai_status <= 2 || mondai_giver_id == window.django.user_id) {
        mondai.UpdateMondaiQnA(
          {
            domid: ".mondai_qna",
            yami: mondai_status == 0 ? mondai_yami : false
          },
          {
            filter: JSON.stringify({ mondai_id: data.id })
          }
        );
      }
      // Make question input available again on qna's update
      $("#ques_input").val("");
      $("form").each(function(index) {
        if (this.id == "mondai_show_push_ques") can_submit[index] = true;
      });
      mondai_show_can_push_ques = true;
    }

    function update_comments() {
      mondai.UpdateMondaiComments(
        {
          domid: ".mondai_content_comments"
        },
        {
          filter: JSON.stringify({ mondai_id: mondai_id })
        }
      );
    }

    function toggle_form_visibility(data) {
      // push ques
      if (
        data.user_id.id == window.django.user_id ||
        window.django.user_id == null ||
        data.status != 0
      ) {
        $("#mondai_show_push_ques").addClass("hidden");
      } else {
        $("#mondai_show_push_ques").removeClass("hidden");
      }
      // for guests
      if (window.django.user_id === null)
        $(".for_guests").removeClass("hidden");
      else $(".for_guests").addClass("hidden");
      // push answ
      if (data.user_id.id != window.django.user_id) {
        $("#mondai_show_push_answ_btn").addClass("hidden");
      } else {
        $("#mondai_show_push_answ_btn").removeClass("hidden");
      }
      // evaluation panel
      if (data.user_id.id == window.django.user_id) {
        $(".evaluation_panel").addClass("hidden");
      } else {
        $(".evaluation_panel").removeClass("hidden");
      }
      // giver panel
      if (data.user_id.id == window.django.user_id) {
        $("#mondai_giver_panel").removeClass("hidden");
        $("#memo_preview_div").removeClass("hidden");
        if (data.status == 0) {
          $("#mondai_giver_panel_solved").addClass("hidden");
          $("#mondai_giver_panel_unsolved").removeClass("hidden");
          $("#kaisetu_preview_div").removeClass("hidden");
        } else if (data.status == 4) {
          $("#mondai_giver_panel_solved").addClass("hidden");
          $("#mondai_giver_panel_unsolved").addClass("hidden");
          $("#kaisetu_preview_div").addClass("hidden");
        } else {
          $("#mondai_giver_panel_solved").removeClass("hidden");
          $("#mondai_giver_panel_unsolved").addClass("hidden");
          $("#kaisetu_preview_div").addClass("hidden");
        }
      } else {
        $("#mondai_giver_panel").addClass("hidden");
      }
    }

    function init_evaluation_panel() {
      if (
        window.django.user_id === null ||
        window.django.user_id == mondai_giver_id
      ) {
        $(".evaluation_panel").addClass("hidden");
        $(".paticipants_panel").addClass("hidden");
      } else {
        // set starbar initial value
        $.post(
          common.urls.star_api,
          {
            csrfmiddlewaretoken: $("[name=csrfmiddlewaretoken]").val(),
            filter: JSON.stringify({
              user_id__exact: window.django.user_id,
              mondai_id__exact: mondai_id
            })
          },
          function(queryData) {
            if ((queryData.data.length = 1 && queryData.data[0].value)) {
              $("#starbar").attr("data-slider-value", queryData.data[0].value);
            } else {
              $("#starbar").attr("data-slider-value", 0);
            }
          }
        );
        // remove comment panel
        // TODO: Duplicated. Combine this into UpdateMondaiComments().
        $.post(
          common.urls.comment_api,
          {
            csrfmiddlewaretoken: $("[name=csrfmiddlewaretoken]").val(),
            filter: JSON.stringify({
              user_id__exact: window.django.user_id,
              mondai_id__exact: mondai_id
            })
          },
          function(queryData) {
            if (queryData.data.length >= 1) {
              $(".paticipants_panel").html("");
              $(".paticipants_panel").addClass("hidden");
            } else {
              $(".paticipants_panel").removeClass("hidden");
            }
          }
        );
      }
    }

    function set_default_channel() {
      $("#default_channel").attr("value", "mondai-" + mondai_id);
    }

    // bind F5 to update_unsolved()
    $(document).on("keydown", function(e) {
      if ((e.which || e.keyCode) == 116) {
        update_mondai_kaisetu();
        e.preventDefault();
      }
    });

    function on_memobar_update() {
      $("#memo_preview_hint").addClass("hidden");

      if (mondai_giver_id == window.django.user_id) {
        sidebar.CloseMemo();
        return;
      }

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
        while (memoHashObjKeys.length > 50) {
          key2del = memoHashObjKeys.pop();
          delete memoHashObj[key2del];
        }
        // updates cookie
        common.setCookie("memo", JSON.stringify(memoHashObj), 2);
      }
    }

    function fill_data_in_giver_panel(data) {
      if ((data.user_id.id == window.django.user_id)) {
        memo_hash = common.hash(data.memo);

        $(".memo_textarea").each(function() {
          $(this).val(data.memo);
        });
        $(".kaisetu_textarea").each(function() {
          $(this).val(data.kaisetu);
        });
        manually_apply_markdown();
        $(".toggle_yami_label").each(function() {
          $(this).html(
            data.yami ? gettext("uncheck as yami") : gettext("check as yami")
          );
        });
        if (data.status <= 3) {
          $("input[name='toggle_status_hidden']").removeClass("hidden");
          $(".toggle_status_hidden").html(
            data.status == 3
              ? gettext("uncheck as hidden")
              : gettext("check as hidden")
          );
          $(".toggle_status_hidden").removeClass("hidden");
        } else {
          $("input[name='toggle_status_hidden']").addClass("hidden");
          $(".toggle_status_hidden").addClass("hidden");
        }
      }
    }

    // Previews
    function manually_apply_markdown() {
      if ($(".kaisetu_textarea").length > 0) {
        $("#kaisetu_preview").html(
          common.text2md($(".kaisetu_textarea").val())
        );
      }
    }

    $(".kaisetu_textarea").on("input", function() {
      $("#kaisetu_preview").html(common.text2md($(".kaisetu_textarea").val()));
    });

    $(".memo_textarea").each(function() {
      $(this).on("input", function() {
        var text = $(this).val();

        if (common.hash(text) == memo_hash) {
          if (!sidebar.IsSmallScreen()) sidebar.CloseMemo();
          $("#memo_preview_hint").addClass("hidden");
        } else {
          if (!sidebar.IsSmallScreen()) sidebar.OpenMemo();
          $("#memo_preview_hint").removeClass("hidden");
        }

        $(".mondai_memo").html(common.text2md(text));
      });
    });

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

    $("#mondai_show_push_answ").on("submit", function(e) {
      var formData = $(this).serializeArray();
      $.post(common.urls.mondai_show_push_answ, formData, function() {
        update_mondai_kaisetu();
      });
      e.preventDefault();
    });

    $("#mondai_show_push_ques").on("submit", function(e) {
      var formData = $(this).serializeArray();
      if (mondai_show_can_push_ques) {
        $.post(common.urls.mondai_show_push_ques, formData, function() {
          update_mondai_kaisetu();
        });
      }
      mondai_show_can_push_ques = false;
      e.preventDefault();
    });

    $("#mondai_giver_panel_unsolved").on("submit", function(e) {
      var formData = $(this).serializeArray();
      $.post(common.urls.mondai_show_update_soup, formData, function() {
        update_mondai_kaisetu();
      });
      e.preventDefault();
    });

    $("#mondai_giver_panel_solved").on("submit", function(e) {
      var formData = $(this).serializeArray();
      $.post(common.urls.mondai_show_update_soup, formData, function() {
        update_mondai_kaisetu();
      });
      e.preventDefault();
    });

    function _fetch_data_to_modal() {
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
    }

    $(".mondai_qna").on("DOMSubtreeModified", function() {
      $(".qna_edit").each(_fetch_data_to_modal);
    });

    $(".mondai_content_comments").on("DOMSubtreeModified", function() {
      $(".comment_edit").each(_fetch_data_to_modal);
    });

    common.bindEnterToSubmit("#comment_input", "#comment_submit");

    // Initialize slider
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
    initUI();
  });
});
