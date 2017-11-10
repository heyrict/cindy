require(["jquery", "./mondai.js"], function($, mondai) {
  function update_unsolved() {
    mondai.UpdateMondaiList(
      { domid: "#mondai_list_unsolved" },
      {
        filter: JSON.stringify({ status__exact: 0 })
      }
    );
  }

  var order = "-modified";
  function update_others(page) {
    page = page || 1;
    mondai.UpdateMondaiList(
      {
        domid: "#mondai_list_others",
        paginator_class: "mondai_others_paginator"
      },
      {
        filter: JSON.stringify({ status__gt: 0 }),
        order: order,
        items_per_page: 20,
        page: page
      }
    );
  }

  $(document).ready(function() {
    // mondai unsolved list
    update_unsolved();

    // mondai others list
    $("#mondai_list_others").on("DOMSubtreeModified", function() {
      $(".mondai_others_paginator").each(function() {
        $(this).on("click", function() {
          update_others($(this).attr("value"));
        });
      });
    });
    update_others(1);

    // bind refresh button & F5 to update_unsolved()
    $("#mondai_unsolved_update").on("click", update_unsolved);
    $(document).on("keydown", function(e) {
      if ((e.which || e.keyCode) == 116) {
        $("#mondai_unsolved_update").click();
        e.preventDefault();
      }
    });

    // sorting buttons
    $(".mondai_list_others_sort").on("click", function() {
      if ($(this).attr("id") == "time_asc_btn") order = "modified";
      else if ($(this).attr("id") == "time_desc_btn") order = "-modified";
      else if ($(this).attr("id") == "score_asc_btn") order = "score";
      else if ($(this).attr("id") == "score_desc_btn") order = "-score";
      else if ($(this).attr("id") == "star_count_asc_btn") order = "star__count";
      else if ($(this).attr("id") == "star_count_desc_btn") order = "-star__count";

      update_others(1);
    });
    $("#search_btn").on("click", function(){
        filter = "title_contains=" + $("search_word").value;
        update_others(1);
    };)
  });
});
