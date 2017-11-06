define(["jquery", "marked", "moment", "moment-countdown"], function(
  $,
  marked,
  moment
) {
  function setCookie(c_name, value, expiredays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + expiredays);
    document.cookie =
      c_name +
      "=" +
      escape(value) +
      (expiredays == null ? "" : ";expires=" + exdate.toGMTString());
  }

  function getCookie(c_name) {
    if (document.cookie.length > 0) {
      c_start = document.cookie.indexOf(c_name + "=");
      if (c_start != -1) {
        c_start = c_start + c_name.length + 1;
        c_end = document.cookie.indexOf(";", c_start);
        if (c_end == -1) c_end = document.cookie.length;
        return unescape(document.cookie.substring(c_start, c_end));
      }
    }
    return "";
  }

  function hash(string) {
    var i, chr;
    var hash = 0;
    if (string.length === 0) return hash;
    for (i = 0; i < string.length; i++) {
      chr = string.charCodeAt(i);
      hash = (hash << 5) - hash + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  }

  urls = {
    register: "/users/add",
    password_change: "/users/password_change",
    index: "/",
    lobby_chat: "/lobby/chat",
    lobby_channel: "/lobby/channel",
    mondai: "/mondai",
    mondai_list: "/mondai_list",
    mondai_add: "/mondai/add",
    mondai_show: pk => "/mondai/show/" + pk,
    mondai_show_push_ques: "/mondai/show/push_ques",
    mondai_show_push_answ: "/mondai/show/push_answ",
    mondai_show_update_soup: "/mondai/show/update_soup",
    mondai_star: "/mondai/show/star",
    mondai_star_remove: "/mondai/show/remove_star",
    mondai_comment: "/mondai/comment",
    profile: pk => "/profile/" + pk,
    profile_edit: "/profile/edit",
    profile_selledsoup: pk => "/profile/selledsoup/" + pk,
    profile_mystar: pk => "/profile/mystar/" + pk,
    award_change: "/profile/award_change",
    set_language: "/language",
    mondai_list_api: "/api/mondai_list",
    mondai_edit_api: "/api/mondai_edit",
    profile_api: "/api/profile",
    star_api: "/api/star",
    lobby_api: "/api/lobby",
    comment_api: "/api/comment"
  };

  function _norm_openchat(string) {
    return string.replace(
      /\"chat:\/\/([0-9a-zA-Z\-]+)\"/g,
      "\"javascript:sidebar.OpenChat('$1');\""
    );
  }

  function _norm_countdown(string) {
    return string.replace(
      /\/countdown\(([^)]+)\)\//g,
      "<span class='btn disabled countdownobj' until='$1'>CountDownObject</span>"
    );
  }

  function StartCountdown(selector) {
    window.setInterval(function() {
      $(selector || ".countdownobj").each(function() {
        until = moment($(this).attr("until"));
        $(this).html(
          moment().diff(until) < 0
            ? moment()
                .countdown(until)
                .toString()
            : `<font color='red'>${gettext("Time Out")}</font>`
        );
      });
    }, 1000);
  }

  function LinkNorm(string) {
    string = _norm_openchat(string);
    string = _norm_countdown(string);
    return string;
  }

  function line2md(string) {
    string = string
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/^([*+-]) /g, "\\$1 ")
      .replace(/^(\d+)\. /g, "$1\\. ")
      .replace(/\n/g, "<br />");

    return marked(string).replace(/<\/?p>/g, "");
  }

  function LinkNormAll(selector) {
    if ($(selector).length > 0) {
      $(selector).each(function(index) {
        $(this).html(LinkNorm($(this).html()));
      });
    }
  }

  return {
    hash: hash,
    getCookie: getCookie,
    setCookie: setCookie,
    urls: urls,
    line2md: line2md,
    LinkNorm: LinkNorm,
    LinkNormAll: LinkNormAll,
    StartCountdown: StartCountdown
  };
});
