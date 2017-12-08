define(["jquery", "./common", "moment"], function($, common, moment) {
  /* Wrapping functions
   * Parameters:
   * settings: {
   *   domid: String, the domSelector to be updated,
   *   paginator_class: class name of the paginator (if exists),
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

  function UpdateProfileList(settings, queryObject) {
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
    $.post(common.urls.profile_list_api, params, function(data) {
      var listhtml = _render_profile_list_data(data.data);
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

  function UpdateProfileProfile(settings, queryObject) {
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
        id: 1
      },
      queryObject || {}
    );
    $.post(common.urls.profile_api, params, function(data) {
      tablehtml = _render_profile_profile_table(data.data);
      $(settings.domid).html(tablehtml);
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

  function UpdateMondaiComments(settings, queryObject) {
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

  function UpdateProfileComments(settings, queryObject) {
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
      $(settings.domid).html(_render_profile_comments(data));
    });
  }

  function RenderMondaiTitle(data) {
    returns =
      "[" +
      common.genre_code_dict[data.genre] +
      (data.yami ? "×" + gettext("yami") : "") +
      "]";
    returns += data.title;
    if (data.status >= 2) {
      returns +=
        "<font color=gray>(" +
        common.status_code_dict[data.status] +
        ")</font>";
    }
    return returns;
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
      paginator_classname: "pagination-sm pagination-centered"
    });
  }

  // sui_hei:Mondai_show_api: Render mondai's header data
  function RenderMondaiContentHeader(data) {
    var giverstr = `
<li><b>${gettext("giver")}: ${data.user_id.nickname}${data.user_id.current_award
      ? _render_useraward(data.user_id.current_award)
      : ""}</b></li>`;
    var createdstr = `
<li>${gettext("created")}: ${moment(data.created).calendar()}</li>`;
    return "<ul style='left: 10px;'>" + giverstr + createdstr + "</ul>";
  }

  // sui_hei:Mondai_show_api: Render mondai's content
  function RenderMondaiContentContent(data) {
    if (data.status >= 3 && data.user_id.id != window.django.user_id) {
      mondai_content_content = gettext(
        "This soup's status is set to %s, which means you cannot view it."
      ).replace(/%s/, common.status_code_dict[data.status]);
      mondai_content_content =
        "<font color='#aaa'>" + mondai_content_content + "</font>";
    } else {
      mondai_content_content = common.text2md(data.content);
    }
    return mondai_content_content;
  }

  function _render_label(status_code) {
    var class_label = common.status_class_dict[status_code];
    var color_label = common.status_color_dict[status_code];
    var name_label = common.status_code_dict[status_code];
    return `<span class="status_label ${class_label}"><font color="${color_label}">${name_label}</font></span>`;
  }

  function _render_star(value) {
    scaleOne = x => Math.floor(x * 10) / 10;
    star_bubble = `
<span class="status_label status_unsolved"><font color="#cb4b16">${scaleOne(
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
    return `
[${common
      .genre_code_dict[genre_code]}${yami ? " &times; " + gettext("yami") : ""}]`;
  }

  function _render_score(score, star_count) {
    var scale_one = num => Math.floor(num * 10) / 10;
    return star_count > 0
      ? `<span class="mondai_score">${scale_one(score)}✯${star_count}</span>`
      : "";
  }

  function _render_giver(user) {
    var award = user.current_award ? _render_useraward(user.current_award) : "";
    return `
<a href="${common.urls.profile(
      user.id
    )}" class="bul">${user.nickname}</a><b>${award}</b>`;
  }

  function _render_title(mondai) {
    return `
<span class="title_label"><a href="${common.urls.mondai_show(
      mondai.id
    )}">${_render_genre(mondai.genre, mondai.yami) + mondai.title}</a></span>`;
  }

  function _render_suffix(mondai) {
    return `
<span style="float:right; text-decoration:bold;"> ${_render_giver(
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

  function _render_profile_list_data(listobj) {
    var output = String(),
      fields = {
        id: "ID",
        nickname: gettext("nickname"),
        date_joined: gettext("date_joined")
      };
    listobj = listobj || [];

    output += "<table class='table table-hover table-bordered span12'>";
    output += _render_profile_list_table_header(fields);

    output += _render_profile_list_table_contents(fields, listobj);

    output += "</table><div class='clearfix'></div>";
    return output;
  }

  function _render_profile_list_table_header(fields) {
    var returns = "<thead><tr class='header'>";
    for (f in fields) {
      returns += "<th>" + fields[f] + "</th>";
    }
    returns += "</tr></thead>";
    return returns;
  }

  function _render_profile_list_table_contents(fields, profile) {
    var returns = "<tbody>";

    profile.forEach(function(pf) {
      returns += `<tr onClick="window.location.href='${common.urls.profile(
        pf.id
      )}'">`;
      for (f in fields) {
        returns += "<td>";
        if (f == "date_joined") {
          returns += moment(pf[f]).calendar();
        } else if (f == "nickname") {
          returns += pf[f];
          returns += pf.current_award
            ? " [" + pf.current_award.award_id[0].name + "]"
            : "";
          returns += "<font color='#888'>";
          returns += "</font>";
        } else {
          returns += pf[f];
        }
        returns += "</td>";
      }
      returns += "</tr>";
    });

    returns += "</tbody>";
    return returns;
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
        output += `
<a class="lobby_message_edit" value="${lobby.id}" 
  target="lobby" href="javascript:void(0);" role="button"
  data-toggle="modal" data-target="#message_edit_modal">
  [${gettext("edit")}]
</a>`;
      output += "</span>";

      output += `
<span class='pull-${isMyChat
        ? "right"
        : "left"}' style='max-width:23%; color:#666'>`;
      output += `
<a href="${common.urls.profile(lobby.user_id.id)}" style="color:#888">${lobby
        .user_id.nickname}</a>
      `;
      output += lobby.user_id.current_award
        ? "[" + lobby.user_id.current_award.award_id[0].name + "]"
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
        max_tagnum:
          Math.max(window.outerWidth, window.innerWidth) < 900 ? 4 : 8,
        classname: "paginator",
        paginator_classname: "pagination-centered"
      },
      params
    );
    var returns = `<div class="text-center"><ul class='pagination ${params.paginator_classname}'>`;

    returns += `
<li class="previous ${params.current_page > 1 ? "" : "disabled"}">
  <a href="javascript:void(0);" value="${params.current_page -
    1}" class="${params.classname}">
    ${gettext("prev")}
  </a>
</li>`;

    // Judging tags on which pages to show
    var _left_diff = Math.max(params.current_page - 1, 0),
      _right_diff = Math.max(params.num_pages - params.current_page, 0),
      _left_tagnum,
      _right_tagnum,
      max_tagnum = params.max_tagnum;

    if (_left_diff >= max_tagnum / 2 && _right_diff >= max_tagnum / 2) {
      _left_tagnum = params.current_page - max_tagnum / 2;
      _right_tagnum = params.current_page + max_tagnum / 2;
    } else if (_left_diff < max_tagnum / 2 && _right_diff < max_tagnum / 2) {
      _left_tagnum = params.current_page - _left_diff;
      _right_tagnum = params.current_page + _right_diff;
    } else if (_left_diff < max_tagnum / 2) {
      _left_tagnum = Math.max(params.current_page - _left_diff, 1);
      _right_tagnum = Math.min(
        params.current_page + max_tagnum - _left_diff,
        params.num_pages
      );
    } else {
      _right_tagnum = Math.min(
        params.current_page + _right_diff,
        params.num_pages
      );
      _left_tagnum = Math.max(
        params.current_page - max_tagnum + _right_diff,
        1
      );
    }

    console.log({
      left_diff: _left_diff,
      right_diff: _right_diff,
      left_tagnum: _left_tagnum,
      right_tagnum: _right_tagnum,
      max_tagnum: max_tagnum
    });

    for (i = _left_tagnum; i < params.current_page; ++i) {
      returns += `<li><a href="javascript:void(0);" value="${i}" class="${params.classname}">${i}</a></li>`;
    }

    returns += `
<li class="active">
  <a href="javascript:void(0);" value="${params.current_page}" class="${params.classname}">
    ${params.current_page}
  </a>
</li>`;

    for (i = params.current_page + 1; i <= _right_tagnum; ++i) {
      returns += `<li><a href="javascript:void(0);" value="${i}" class="${params.classname}">${i}</a></li>`;
    }

    returns += `
<li class="next ${params.current_page < params.num_pages ? "" : "disabled"}">
  <a href="javascript:void(0);" value="${params.current_page +
    1}" class="${params.classname}">
    ${gettext("next")}
  </a>
</li>`;

    returns += "</ul></div>";
    return returns;
  }

  // sui_hei:comments_api: render profile comments
  function _render_profile_comments(data) {
    var commentstr = String();
    data.data.forEach(function(comment) {
      commentstr += "<table class='table table-bordered col-xs-12'>";
      commentstr += "<tr>";
      commentstr += `
<th>
  <a href=${common.urls.mondai_show(comment.mondai_id.id)}>
    ${comment.mondai_id.title}
  </a>
</th>`;
      commentstr += `<td>${common.line2md(comment.content)}</td>`;
      commentstr += "</tr>";
      commentstr += "</table>";
    });
    return commentstr;
  }

  // sui_hei:comments_api: render mondai's comments
  function _render_mondai_content_comments(data) {
    var commentstr = String();
    data.data.forEach(function(comment) {
      commentstr += "<div class='well' style='background:#e2d6b2;'>";
      commentstr += "<div>";
      commentstr += common.line2md(comment.content);
      if (comment.user_id.id == window.django.user_id)
        commentstr += `
<a class="comment_edit" target="comment" value="${comment.id}" href="javascript:void(0);"
  role="button" class="btn" data-toggle="modal" data-target="#message_edit_modal">
  [${gettext("edit")}]
</a>`;
      commentstr += "</div>";
      commentstr += `
<div class="pull-right">
  ——
  <a style="color:#333" href="${common.urls.profile(comment.user_id.id)}">
    ${comment.user_id.nickname} 
  </a>
  ${_render_useraward(comment.user_id.current_award)}
</div>`;
      commentstr += "</div>";
    });
    return commentstr;
  }

  function _render_mondai_qblock(data, index) {
    index += 1;
    var returns = `
<div class="col-xs-6">
  <div class="QBlock">
    <span style="background:#268bd2; border-radius:20px; padding:2px; color:#ffffff; font:bold">${index}</span>
    <span>
      <a href="${common.urls.profile(data.user_id.id)}">
        ${data.user_id.nickname}
      </a>
      ${data.user_id.current_award ? _render_useraward(data.user_id.current_award) : ""}
    </span>
    <div style="margin-top:5px; border-bottom:1px solid #268bd2"></div>
    <div>
      ${common.line2md(data.shitumon)}`;
    if (!data.kaitou && data.user_id.id == window.django.user_id) {
      returns += `
<a class="qna_edit" target="shitumon" value="${data.id}" href="javascript:void(0);"
  role="button" class="btn" data-toggle="modal" data-target="#message_edit_modal">
  [${gettext("edit")}]
</a>`;
    }
    returns += "</div></div></div>";
    return returns;
  }

  function _render_mondai_ablock(data, index) {
    var ABlock = "<div class='col-xs-6'><div class='ABlock'>";

    if (window.django.user_id == data.owner_id.id) {
      ABlock += _render_mondai_ablock_giver(data, index);
    } else {
      ABlock += _render_mondai_ablock_others(data, index);
    }
    ABlock += "</div></div>";
    return ABlock;
  }

  function _render_mondai_ablock_others(data, index) {
    ABlockOthers = String();
    if (data.kaitou) {
      ABlockOthers += `
<span>
  <a href="${common.urls.profile(data.owner_id.id)}">
    ${data.owner_id.nickname}
  </a>
  ${data.owner_id.current_award
    ? _render_useraward(data.owner_id.current_award)
    : ""}
</span>
<div style="margin-top:5px; border-bottom:1px solid #268bd2"></div>`;
      ABlockOthers += "<div>";
      if (data.true) {
        ABlockOthers += "<font size='7' color='#dc322f'>&#9996;</font>";
      }
      if (data.good) {
        ABlockOthers += "<font size='7' color='#b58900'>&#128077;</font>";
      }
      ABlockOthers += `${common.line2md(data.kaitou)}</div>`;
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
      ABlockGiver += `
  ${common.line2md(data.kaitou)}
  <a class="qna_edit" target="kaitou" value="${data.id}" href="javascript:void(0);"
    role="button" class="btn" data-toggle="modal" data-target="#message_edit_modal">
    [${gettext("edit")}]
  </a>
</div>`;
    } else {
      ABlockGiver += `
<div style="width:100%; float:left;">
  <input id="answ_input" name="push_answ_${data.id}" type="text">
</div>`;
    }
    ABlockGiver += `
<div class="clear"></div>
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

  function _render_profile_profile_table(data) {
    var returns = "",
      isMe = data.id == window.django.user_id,
      rows = [
        {
          name: "nickname",
          grid_name: gettext("Nickname"),
          grid_data:
            data.nickname +
            (data.current_award ? _render_useraward(data.current_award) : "")
        },
        {
          name: "availdable_awards",
          grid_name: gettext("Awards"),
          grid_data: isMe
            ? _render_profile_awards_form(data)
            : _render_profile_awards_list(data)
        },
        {
          name: "date_joined",
          grid_name: gettext("date_joined"),
          grid_data: moment(data.date_joined).calendar()
        },
        {
          name: "last_login",
          grid_name: gettext("last_login"),
          grid_data: data.last_login
            ? moment(data.last_login).calendar()
            : gettext("None")
        },
        { name: "mondai_count", grid_name: gettext("Soup Count") },
        { name: "ques_count", grid_name: gettext("Question Count") },
        { name: "goodques_count", grid_name: gettext("Good Question Count") },
        { name: "trueques_count", grid_name: gettext("True Answer Count") },
        { name: "comment_count", grid_name: gettext("Comment Count") },
        { name: "snipe", grid_name: gettext("Snipe Count") },
        { name: "sniped", grid_name: gettext("Sniped Count") },
        {
          name: "profile",
          grid_name:
            gettext("Profile") +
            (isMe
              ? `<a href="${common.urls.profile_edit}">[${gettext("edit")}]</a>`
              : ""),
          grid_data: common.text2md(data.profile)
        },
        {
          name: "change_password",
          grid_name: gettext("Change Password"),
          secret: true,
          grid_data:
            "<a href='" +
            common.urls.password_change +
            "'>" +
            gettext("Click Here") +
            "</a>"
        }
      ];
    returns += "<table class='table table-bordered col-xs-12'>";
    rows.forEach(function(grid) {
      grid = $.extend(
        {
          secret: false
        },
        grid
      );
      if (isMe || !grid.secret) {
        returns += "<tr>";
        returns +=
          "<th>" +
          (grid.grid_name != null ? grid.grid_name : grid.name) +
          "</th>";
        returns +=
          "<td>" +
          (grid.grid_data != null ? grid.grid_data : data[grid.name]) +
          "</td>";
        returns += "</tr>";
      }
    });
    returns += "</table>";
    return returns;
  }

  function _render_profile_awards_form(data) {
    var returns = `
<form id="profile_awards_form" method="post">
  <select name="useraward">
    <option value="">${gettext("None")}</option>`;
    data.available_awards.forEach(function(useraward) {
      returns +=
        "<option value='" +
        useraward.id +
        "'" +
        (data.current_award && useraward.id == data.current_award.id
          ? "selected='selected'"
          : "") +
        ">";
      returns += useraward.award_id[0].name;
      returns += "</option>";
    });
    returns += `
    <input type="submit" name="award_change" value="${gettext("change")}"
      style="width:10%; font-size:14px; margin-top:0px;">
  </select>
</form>`;
    return returns;
  }

  function _render_profile_awards_list(data) {
    var returns = [];
    data.available_awards.forEach(function(useraward) {
      returns.push(_render_useraward(useraward));
    });
    return returns.join(" ");
  }

  function _render_useraward(data, additionalClass) {
    additionalClass = additionalClass || "";
    if (!data) return "";
    else 
      return `
<a tabindex="0" href="javascript:void(0);" role="button"
  class="${additionalClass}" style="color:black;" data-toggle="popover"
  title="${data.award_id[0].name}" 
  data-content="${data.award_id[0].description}<br />
    <span class='pull-right' style='color:#ff582b; font-weight:bold;'>🏆${data.created}</span>">
  [${data.award_id[0].name}]
</a>
    `;
  }

  return {
    UpdateMondaiList: UpdateMondaiList,
    UpdateMystarList: UpdateMystarList,
    UpdateProfileList: UpdateProfileList,
    RenderLobbyData: RenderLobbyData,
    RenderLobbyPaginator: RenderLobbyPaginator,
    RenderMondaiTitle: RenderMondaiTitle,
    RenderMondaiContentHeader: RenderMondaiContentHeader,
    RenderMondaiContentContent: RenderMondaiContentContent,
    UpdateMondaiComments: UpdateMondaiComments,
    UpdateProfileComments: UpdateProfileComments,
    UpdateProfileProfile: UpdateProfileProfile,
    UpdateMondaiQnA: UpdateMondaiQnA
  };
});
