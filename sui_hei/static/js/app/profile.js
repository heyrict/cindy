require([
  "jquery",
  "./common",
  "./mondai",
  "bootstrap",
  "bootbox"
], function($, common, mondai) {
  var PageURL = window.location.pathname;
  var path = PageURL.split("/");
  var user_id = path[path.length - 1];

  var mystar_order = "-value";
  function update_mystar(page) {
    mondai.UpdateMystarList(
      {
        domid: "#profile_pane_mystar",
        paginator_class: "profile_mystar_paginator"
      },
      {
        filter: JSON.stringify({ user_id: user_id }),
        order: mystar_order,
        items_per_page: 20,
        page: page
      }
    );
  }

  var mysoup_order = "-modified";
  function update_mysoup(page) {
    mondai.UpdateMondaiList(
      {
        domid: "#profile_pane_mysoup",
        paginator_class: "profile_mysoup_paginator"
      },
      {
        filter: JSON.stringify({ user_id: user_id }),
        order: mysoup_order,
        items_per_page: 20,
        page: page
      }
    );
  }

  function update_comment(page) {
    mondai.UpdateProfileComments(
      {
        domid: "#profile_pane_comment",
        paginator_class: "profile_comments_paginator"
      },
      {
        filter: JSON.stringify({ user_id: user_id }),
        order: "-id",
        items_per_page: 20,
        page: page
      }
    );
  }

  function update_profile() {
    mondai.UpdateProfileProfile(
      {
        domid: "#profile_pane_profile"
      },
      {
        id: user_id
      }
    );
  }

  $(document).ready(function() {
    loaded = {
      mystar: false,
      mysoup: false,
      comments: false,
      profile: false
    };
    $("a[data-target='#profile_pane_mystar']").on("show.bs.tab", function() {
      if (!loaded["mystar"]) {
        update_mystar(1);
        loaded["mystar"] = true;
      }
    });
    $("a[data-target='#profile_pane_mysoup']").on("show.bs.tab", function() {
      if (!loaded["mysoup"]) {
        update_mysoup(1);
        loaded["mysoup"] = true;
      }
    });
    $("a[data-target='#profile_pane_comment']").on("show.bs.tab", function() {
      if (!loaded["comment"]) {
        update_comment(1);
        loaded["comment"] = true;
      }
    });

    update_profile();

    $("#profile_pane_mystar").on("DOMSubtreeModified", function() {
      $(".profile_mystar_paginator").each(function() {
        $(this).on("click", function() {
          update_mystar($(this).attr("value"));
        });
      });
      $(".remove_star_button").on("click", function() {
        var csrftoken = $("[name=csrfmiddlewaretoken]").val();
        var star_id = this.value;
        bootbox.confirm(
          `<p>${gettext(
            "You cannot revert change if you delete the star!"
          )}</p><p>${gettext("Continue?")}</p>`,
          function(conf) {
            if (conf) {
              jQuery.post(
                common.urls.mondai_star_remove,
                {
                  csrfmiddlewaretoken: csrftoken,
                  star_id: star_id
                },
                function(data) {
                  if (data.error_message) {
                    bootbox.alert(error_message);
                  } else {
                    update_mystar(1);
                  }
                }
              );
            }
          }
        );
      });
    });
    $("#profile_pane_mysoup").on("DOMSubtreeModified", function() {
      $(".profile_mysoup_paginator").each(function() {
        $(this).on("click", function() {
          update_mysoup($(this).attr("value"));
        });
      });
    });
    $("#profile_pane_comment").on("DOMSubtreeModified", function() {
      $(".profile_comment_paginator").each(function() {
        $(this).on("click", function() {
          update_comment($(this).attr("value"));
        });
      });
    });
    $("#profile_pane_profile").on("DOMSubtreeModified", function() {
      $("#profile_awards_form").on("submit", function(e) {
        var formData = $(this).serializeArray();
        formData = [
          {
            name: "csrfmiddlewaretoken",
            value: $("[name=csrfmiddlewaretoken]").val()
          }
        ].concat(formData);
        $.post(common.urls.award_change, formData, function(data) {
          if (data.error_message) bootbox.alert(data.error_message);
          else update_profile();
        });
        e.preventDefault();
      });
    });
  });
});
