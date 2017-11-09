define(["jquery", "./common", "moment"], function($, common, moment) {
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
        listhtml += _render_paginator(
          data.page,
          data.num_pages,
          settings.paginator_class
        );
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
    console.log(params);
    $.post(common.urls.star_api, params, function(data) {
      var listhtml = _render_mystar_data(data.data);
      if (data.page) {
        listhtml += _render_paginator(
          data.page,
          data.num_pages,
          settings.paginator_class
        );
      }
      $(settings.domid).html(listhtml);
    });
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

  function _render_star(value) {
    scaleOne = x => Math.floor(x * 10) / 10;
    star_bubble = `<span class="status_label status_unsolved"><font color="#cb4b16">${scaleOne(
      value
    )}</font></span>`;
    return star_bubble;
  }

  function _render_remove_star_btn(star) {
    return "<button class='remove_star_button' style='padding:inherit;background:inherit;color:red;' value='${star.id}'>⛔</button>";
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

  function _render_paginator(current_page, num_pages, classname) {
    classname = classname || "paginator";
    var returns = "<div class='pagination pagination-centered'><ul>";

    returns += `<li class="previous ${current_page > 1
      ? ""
      : "disabled"}"><a href="javascript:void(0);" value="${current_page -
      1}" class="${classname}">${gettext("prev")}</a></li>`;

    for (i = Math.max(current_page - 5, 1); i < current_page; ++i) {
      returns += `<li><a href="javascript:void(0);" value="${i}" class="${classname}">${i}</a></li>`;
    }

    returns += `<li class="active"><a href="javascript:void(0);" value="${current_page}" class="${classname}">${current_page}</a></li>`;

    for (
      i = current_page + 1;
      i <= Math.min(current_page + 5, num_pages);
      ++i
    ) {
      returns += `<li><a href="javascript:void(0);" value="${i}" class="${classname}">${i}</a></li>`;
    }

    returns += `<li class="next ${current_page < num_pages
      ? ""
      : "disabled"}"><a href="javascript:void(0);" value="${current_page +
      1}" class="${classname}">${gettext("next")}</a></li>`;

    returns += "</ul></div>";
    return returns;
  }

  return {
    UpdateMondaiList: UpdateMondaiList,
    UpdateMystarList: UpdateMystarList
  };
});
