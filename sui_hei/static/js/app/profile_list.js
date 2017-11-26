require(["jquery", "./common", "./mondai"], function($, common, mondai) {
  order = "-id";
  function update_profile_list(page) {
    page = page || 1;
    mondai.UpdateProfileList(
      {
        domid: "#profile_list",
        paginator_class: "profile_list_paginator"
      },
      {
        order: order,
        items_per_page: 10,
        page: page
      }
    );
  }

  $(document).ready(function() {
    $("#profile_list").on("DOMSubtreeModified", function() {
      $(".profile_list_paginator").each(function() {
        $(this).on("click", function() {
          update_profile_list($(this).attr("value"));
        });
      });
    });
    update_profile_list(1);
  });
});
