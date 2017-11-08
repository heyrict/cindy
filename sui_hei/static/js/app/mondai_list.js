require(["jquery", "./mondai.js"], function($, mondai) {
  function update_others(page) {
    page = page || 1;
    mondai.UpdateMondaiList(
      {
        domid: "#mondai_list_others",
        paginator_class: "mondai_others_paginator"
      },
      {
        filter: JSON.stringify({ status__gt: 0 }),
        items_per_page: 20,
        page: page
      }
    );
  }

  $(document).ready(function() {
    mondai.UpdateMondaiList(
      { domid: "#mondai_list_unsolved" },
      {
        filter: JSON.stringify({ status__exact: 0 })
      }
    );

    $("#mondai_list_others").bind("DOMSubtreeModified", function() {
      $(".mondai_others_paginator").each(function() {
        $(this).on("click", function() {
          update_others($(this).attr("value"));
        });
      });
    });
    update_others(1);
  });
});
