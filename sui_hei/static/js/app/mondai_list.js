require(["jquery", "./common", "./mondai"], function($, common, mondai) {
  function update_unsolved() {
    mondai.UpdateMondaiList(
      { domid: "#mondai_list_unsolved" },
      {
        filter: JSON.stringify({ status__exact: 0 })
      }
    );
  }

  var order = "-modified";
  var filter = JSON.stringify({ status__gt: 0 });
  function update_others(page) {
    page = page || 1;
    mondai.UpdateMondaiList(
      {
        domid: "#mondai_list_others",
        paginator_class: "mondai_others_paginator"
      },
      {
        filter: filter,
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
    $("#mondai_unsolved_update").on("click", function() {
      update_unsolved();
      update_others(1);
    });
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
      else if ($(this).attr("id") == "star_count_asc_btn")
        order = "star__count";
      else if ($(this).attr("id") == "star_count_desc_btn")
        order = "-star__count";

      update_others(1);
    });

    // search
    common.bindEnterToSubmit("#search_box", "#search_btn");

    var $searchBox = $("#search_box");
    $(".mondai_list_others_search").on("click", function() {
      if ($searchBox.attr("selectedType") == "title")
        filter = JSON.stringify({ title__contains: $searchBox.val() });
      else if ($searchBox.attr("selectedType") == "giver")
        filter = JSON.stringify({
          user_id__nickname__contains: $searchBox.val()
        });
      else if ($searchBox.attr("selectedType") == "content")
        filter = JSON.stringify({ content__contains: $searchBox.val() });
      else filter = JSON.stringify({ status__gt: 0 });
      update_others(1);
    });

    $(".mondai_list_others_search_reset").on("click", function() {
      filter = JSON.stringify({ status__gt: 0 });
      update_others(1);
    });
  });
});
