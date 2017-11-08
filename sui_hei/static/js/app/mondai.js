define(["jquery", "./common", "moment"], function($, common, moment) {
  function UpdateMondaiList(page) {
    page = page || 1;
    var csrftoken = $("[name=csrfmiddlewaretoken]").val();
    return $.post(
      common.urls.mondai_list_api,
      {
        csrfmiddlewaretoken: csrftoken,
        page: page,
        items_per_page: 20
      },
      RenderMondaiList
    );
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
    3: "hidden"
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
    return score > 50
      ? `<span class="mondai_score">${scale_one(score)}✯${star_count}</span>`
      : "";
  }

  function _render_giver(user) {
    var award = user.current_award ? `[${user.current_award.name}]` : "";
    return `<a href="${common.urls.profile(
      user.id
    )}" class="bul">${user.nickname}</a><b>${award}</b>`;
  }

  function _render_data(listobj) {
    var output = String();
    listobj.forEach(function(mondai) {
      output += "<ul><li>";

      output += _render_label(mondai.status);
      output += _render_quescount(
        mondai.quescount_all,
        mondai.quescount_unanswered
      );
      output += `<span class="title_label"><a href="${common.urls.mondai_show(
        mondai.id
      )}">${_render_genre(mondai.genre, mondai.yami) +
        mondai.title}</a></span>`;
      output += _render_score(mondai.score, mondai.star_count);
      output += `<span style="float:right; text-decoration:bold;"> ${_render_giver(
        mondai.user_id
      )} <font color=#888>[${gettext("created")}:${moment(
        mondai.created
      ).calendar()}]</font></span>`;

      output += "</li></ul><div class='clearfix'></div>";
    });
    return output;
  }

  function RenderMondaiList(data) {
    $("#mondai_list_unsolved").html(_render_data(data.data.unsolved));
    $("#mondai_list_others").html(_render_data(data.data.others));
  }

  return {
    UpdateMondaiList: UpdateMondaiList,
    RenderMondaiList: RenderMondaiList
  };
});
