define(["jquery", "./common", "moment"], function($, common, moment) {
  /* Wrapping functions
   * Parameters:
   * settings: {
   *   domid: String, the domSelector to be updated,
   *   paginator_class, class name of the paginator (if exists),
   * }
   * queryObject: Object, which will be passed to django for fetching data: {
   *   csrfmiddlewaretoken: String, default value will be provided,
   *                        and you don't need to pass this explicitly,
   *   order: String, which will be passed to django's QueryObject.order_by(),
   *   filter: String(dict), a stringified objech, which will be passed
   *           to QueryObject.filter() as **kwargs,
   *   items_per_page: int, pass this value only if you want a paginator,
   *   page: int, a value in [1, items_per_page]. data will be fetched in page `page`.
   * }
   */
  function UpdateMondaiList(settings, queryObject) {
    settings = $.extend(
      {
        domid: "test",
        paginator_class: "paginator"
      },
      settings || {}
    );
    var params = $.extend(
      {
        csrfmiddlewaretoken: $("[name=csrfmiddlewaretoken]").val(),
        order: "-modified"
      },
      queryObject || {}
    );
    $.post(common.urls.mondai_list_api, params, function(data) {
      var listhtml = _render_data(data.data);
      if (data.page) {
        listhtml += _render_paginator({
          current_page: data.page,
          num_pages: data.num_pages,
          classname: settings.paginator_class
        });
      }
      $(settings.domid).html(listhtml);
    });
  }

  function UpdateMystarList(settings, queryObject) {
    settings = $.extend(
      {
        domid: "test",
        paginator_class: "paginator"
      },
      settings || {}
    );
    var params = $.extend(
      {
        csrfmiddlewaretoken: $("[name=csrfmiddlewaretoken]").val(),
        order: "-modified"
      },
      queryObject || {}
    );
    $.post(common.urls.star_api, params, function(data) {
      var listhtml = _render_mystar_data(data.data);
      if (data.page) {
        listhtml += _render_paginator({
          current_page: data.page,
          num_pages: data.num_pages,
          classname: settings.paginator_class
        });
      }
      $(settings.domid).html(listhtml);
    });
  }

  // sui_hei:mondai_show_api: render mondai's qnas
  function UpdateMondaiQnA(settings, queryObject) {
    settings = $.extend(
      {
        domid: "test"
      },
      settings || {}
    );
    var params = $.extend(
      {
        csrfmiddlewaretoken: $("[name=csrfmiddlewaretoken]").val(),
        order: "id"
      },
      queryObject || {}
    );
    $.post(common.urls.shitumon_api, params, function(shitumonList) {
      returns = "";
      shitumonList.data.forEach(function(s, index) {
        if (
          settings.yami &&
          window.django.user_id != s.user_id.id &&
          window.django.user_id != s.owner_id.id
        )
          return;
        var QBlockStr = _render_mondai_qblock(s, index);
        var ABlockStr = _render_mondai_ablock(s, index);
        returns += `<div class="HBar">${QBlockStr}${ABlockStr}<div class="clearfix"></div></div>`;
      });
      $(settings.domid).html(returns);
    });
  }

  function RenderMondaiComments(settings, queryObject) {
    settings = $.extend(
      {
        domid: "test",
        paginator_class: "paginator"
      },
      settings || {}
    );
    var params = $.extend(
      {
        csrfmiddlewaretoken: $("[name=csrfmiddlewaretoken]").val(),
        order: "id"
      },
      queryObject || {}
    );
    $.post(common.urls.comment_api, params, function(data) {
      $(settings.domid).html(_render_mondai_content_comments(data));
    });
  }

  // Simply data formatting function
  // sui_hei:lobby_api: render lobby data
  function RenderLobbyData(data) {
    return _render_lobby_data(data.data);
  }

  // sui_hei:lobby_api: render lobby paginator
  function RenderLobbyPaginator(data, paginator_class) {
    return _render_paginator({
      current_page: data.page || 1,
      num_pages: data.num_pages || 1,
      classname: paginator_class || "lobby_paginator",
      paginator_classname: "pagination-mini pagination-centered"
    });
  }

  // sui_hei:Mondai_show_api: Render mondai's header data
  function RenderMondaiContentHeader(data) {
    var giverstr = `<li><b>${gettext("giver")}: ${data.user_id.nickname}${data
      .user_id.current_award
      ? "[" + data.user_id.current_award.name + "]"
      : ""}</b></li>`;
    var createdstr = `<li>${gettext("created")}: ${moment(
      data.created
    ).calendar()}</li>`;
    return "<ul style='left: 10px;'>" + giverstr + createdstr + "</ul>";
  }

  // sui_hei:Mondai_show_api: Render mondai's content
  function RenderMondaiContentContent(data) {
    if (data.status >= 3 && data.user_id.id != window.django.user_id) {
      mondai_content_content = gettext(
        "This soup's status is set to %s, which means you cannot view it."
      ).replace(/%s/, _status_code_dict[data.status]);
      mondai_content_content =
        "<font color='#aaa'>" + mondai_content_content + "</font>";
    } else {
      mondai_content_content = common.text2md(data.content);
    }
    return mondai_content_content;
  }

  // sui_hei:mondai_show_api: render mondai's kaisetu
  function RenderMondaiKaisetu(data) {
    return common.text2md(data.kaisetu);
  }

  _status_class_dict = {
    0: "status_unsolved",
    1: "status_solved",
    2: "status_dazed",
    3: "status_hidden"
  };

  _status_code_dict = {
    0: "unsolved",
    1: "solved",
    2: "dazed",
    3: "hidden",
    4: "forced hidden"
  };

  _status_color_dict = {
    0: "#cb4b16",
    1: "#859900",
    2: "#259185",
    3: "gray"
  };

  _genre_code_dict = {
    0: gettext("Albatross"),
    1: gettext("20th-Door"),
    2: gettext("Little Albat"),
    3: gettext("Others & Formal")
  };

  function _render_label(status_code) {
    var class_label = _status_class_dict[status_code];
    var color_label = _status_color_dict[status_code];
    var name_label = _status_code_dict[status_code];
    return `<span class="status_label ${class_label}"><font color="${color_label}">${name_label}</font></span>`;
  }

  function _render_star(value) {
    scaleOne = x => Math.floor(x * 10) / 10;
    star_bubble = `<span class="status_label status_unsolved"><font color="#cb4b16">${scaleOne(
      value
    )}</font></span>`;
    return star_bubble;
  }

  function _render_remove_star_btn(star) {
    return `<button class='remove_star_button' style='padding:inherit;background:inherit;color:red;' value='${star.id}'>⛔</button>`;
  }

  function _render_quescount(all, unanswered) {
    var label_class = unanswered ? "unanswered" : "answered";
    return `<span class="process_label ${label_class}" style="margin-left:5px;"> ${unanswered}<sub>${all}</sub></span>`;
  }

  function _render_genre(genre_code, yami) {
    return `[${_genre_code_dict[
      genre_code
    ]}${yami ? " &times; " + gettext("yami") : ""}]`;
  }

  function _render_score(score, star_count) {
    var scale_one = num => Math.floor(num * 10) / 10;
    return star_count > 0
      ? `<span class="mondai_score">${scale_one(score)}✯${star_count}</span>`
      : "";
  }

  function _render_giver(user) {
    var award = user.current_award ? `[${user.current_award.name}]` : "";
    return `<a href="${common.urls.profile(
      user.id
    )}" class="bul">${user.nickname}</a><b>${award}</b>`;
  }

  function _render_title(mondai) {
    return `<span class="title_label"><a href="${common.urls.mondai_show(
      mondai.id
    )}">${_render_genre(mondai.genre, mondai.yami) + mondai.title}</a></span>`;
  }

  function _render_suffix(mondai) {
    return `<span style="float:right; text-decoration:bold;"> ${_render_giver(
      mondai.user_id
    )} <font color=#888>[${gettext("created")}:${moment(mondai.created).calendar()}]</font></span>`;
  }

  function _render_data(listobj) {
    var output = String();
    listobj = listobj || [];
    listobj.forEach(function(mondai) {
      output += "<ul><li>";

      output += _render_label(mondai.status);
      output += _render_quescount(
        mondai.quescount_all,
        mondai.quescount_unanswered
      );
      output += _render_title(mondai);
      output += _render_score(mondai.score, mondai.star_count);
      output += _render_suffix(mondai);

      output += "</li></ul><div class='clearfix'></div>";
    });
    return output;
  }

  function _render_mystar_data(listobj) {
    var output = String();
    listobj = listobj || [];
    listobj.forEach(function(star) {
      mondai = star.mondai_id;
      output += "<ul><li>";

      output += _render_star(star.value);
      output += _render_remove_star_btn(star);
      output += _render_quescount(
        mondai.quescount_all,
        mondai.quescount_unanswered
      );
      output += _render_title(mondai);
      output += _render_score(mondai.score, mondai.star_count);
      output += _render_suffix(mondai);

      output += "</li></ul><div class='clearfix'></div>";
    });
    return output;
  }

  function _render_lobby_data(listobj) {
    var output = String();
    listobj = listobj || [];
    listobj.reverse().forEach(function(lobby) {
      lobby.content = common.line2md(lobby.content);
      var isMyChat = window.django.user_id == lobby.user_id.id ? true : false;

      output += `<div class='popover ${isMyChat ? "left" : "right"}'>`;
      output += "<div class='arrow'></div>";
      output += "<div class='popover-content'>";

      output += `<span class='pull-${isMyChat
        ? "left"
        : "right"}' style='max-width:73%;'>`;
      output += lobby.content;
      if (isMyChat)
        output += `<a class="lobby_message_edit" value="${lobby.id}" 
                      target="lobby" href="javascript:void(0);" role="button"
                      data-toggle="modal" data-target="#message_edit_modal">
                      [${gettext("edit")}]</a>`;
      output += "</span>";

      output += `<span class='pull-${isMyChat
        ? "right"
        : "left"}' style='max-width:23%; color:#666'>`;
      output += `<a href="${common.urls.profile(
        lobby.user_id.id
      )}" style="color:#888">${lobby.user_id.nickname}</a>`;
      output += lobby.user_id.current_award
        ? `[${lobby.user_id.current_award.name}]`
        : "";
      output += "</span>";

      output += "<div class='clearfix'></div>";
      output += "</div></div>";
    });
    return output;
  }

  function _render_paginator(params) {
    params = $.extend(
      {
        current_page: 1,
        num_pages: 1,
        classname: "paginator",
        paginator_classname: "pagination-centered"
      },
      params
    );
    var returns = `<div class='pagination ${params.paginator_classname}'><ul>`;

    returns += `<li class="previous ${params.current_page > 1
      ? ""
      : "disabled"}"><a href="javascript:void(0);" value="${params.current_page -
      1}" class="${params.classname}">${gettext("prev")}</a></li>`;

    for (
      i = Math.max(params.current_page - 5, 1);
      i < params.current_page;
      ++i
    ) {
      returns += `<li><a href="javascript:void(0);" value="${i}" class="${params.classname}">${i}</a></li>`;
    }

    returns += `<li class="active"><a href="javascript:void(0);" value="${params.current_page}" class="${params.classname}">${params.current_page}</a></li>`;

    for (
      i = params.current_page + 1;
      i <= Math.min(params.current_page + 5, params.num_pages);
      ++i
    ) {
      returns += `<li><a href="javascript:void(0);" value="${i}" class="${params.classname}">${i}</a></li>`;
    }

    returns += `<li class="next ${params.current_page < params.num_pages
      ? ""
      : "disabled"}"><a href="javascript:void(0);" value="${params.current_page +
      1}" class="${params.classname}">${gettext("next")}</a></li>`;

    returns += "</ul></div>";
    return returns;
  }

  // sui_hei:comments_api: render mondai's comments
  function _render_mondai_content_comments(data) {
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
    return commentstr;
  }

  function _render_mondai_qblock(data, index) {
    index += 1;
    return `
      <div class="QBlock">
          <div style="width:29%; float:left">
              <a href="${common.urls.profile(
                data.user_id.id
              )}">${data.user_id.nickname}</a>
          ${data.user_id.current_award
            ? "[" + data.user_id.current_award.name + "]"
            : ""}

          </div>
          <div class="vertical_line"></div>
          <div style="width:69%; float:right;">
              <span style="background:#268bd2; border-radius:20px; padding:2px; color:#ffffff; font:bold">${index}</span>
              ${data.shitumon}
          </div>
      </div>`;
  }

  function _render_mondai_ablock(data, index) {
    var ABlock = "<div class='ABlock'>";

    if (window.django.user_id == data.owner_id.id) {
      ABlock += _render_mondai_ablock_giver(data, index);
    } else {
      ABlock += _render_mondai_ablock_others(data, index);
    }
    ABlock += "</div>";
    return ABlock;
  }

  function _render_mondai_ablock_others(data, index) {
    ABlockOthers = String();
    if (data.kaitou) {
      ABlockOthers += "<div style='width:69%; float:left'>";
      if (data.true) {
        ABlockOthers += "<font size='7' color='#dc322f'>&#9996;</font>";
      }
      if (data.good) {
        ABlockOthers += "<font size='7' color='#b58900'>&#128077;</font>";
      }
      ABlockOthers += `${common.line2md(data.kaitou)}</div>`;
      ABlockOthers += `<div class="vertical_line"></div>`;
      ABlockOthers += `<div style="width:29%; float:right;">
                    <a href="${common.urls.profile(data.owner_id.id)}">${data
        .owner_id.nickname}</a>
                    ${data.owner_id.current_award
                      ? "[" + data.owner_id.current_award.name + "]"
                      : ""}
                </div>`;
    } else {
      ABlockOthers +=
        "<span style='color:#93a1a1'>" +
        gettext("waiting to be answered") +
        "</span>";
    }
    return ABlockOthers;
  }

  function _render_mondai_ablock_giver(data, index) {
    ABlockGiver = String();
    if (data.kaitou) {
      ABlockGiver += "<div style='width:100%; float:left;'>";
      if (data.true) {
        ABlockGiver += "<font size='7' color='#dc322f'>&#9996;</font>";
      }
      if (data.good) {
        ABlockGiver += "<font size='7' color='#b58900'>&#128077;</font>";
      }
      ABlockGiver += `${common.line2md(data.kaitou)}
      <a class="qna_edit" target="kaitou" value="${data.id}" href="javascript:void(0);"
          role="button" class="btn" data-toggle="modal" data-target="#message_edit_modal">
          [${gettext("edit")}]</a>
      </div>`;
    } else {
      ABlockGiver += `<div style="width:100%; float:left;">
                <input id="answ_input" name="push_answ_${data.id}" type="text">
            </div>`;
    }
    ABlockGiver += `<div class="clear"></div>
          <div style="border-top: 1px solid #268bd288">
              <input name="check_goodques_${data.id}" type="checkbox">
            ${data.good
              ? gettext("uncheck as good-question")
              : gettext("check as good-question")}
              <br>
              <input name="check_trueansw_${data.id}" type="checkbox">
            ${data.true
              ? gettext("uncheck as true-answer")
              : gettext("check as true-answer")}
          </div>`;

    return ABlockGiver;
  }

  return {
    UpdateMondaiList: UpdateMondaiList,
    UpdateMystarList: UpdateMystarList,
    RenderLobbyData: RenderLobbyData,
    RenderLobbyPaginator: RenderLobbyPaginator,
    RenderMondaiContentHeader: RenderMondaiContentHeader,
    RenderMondaiContentContent: RenderMondaiContentContent,
    RenderMondaiKaisetu: RenderMondaiKaisetu,
    RenderMondaiComments: RenderMondaiComments,
    UpdateMondaiQnA: UpdateMondaiQnA
  };
});
