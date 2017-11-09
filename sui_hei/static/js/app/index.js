require(["jquery", "./sidebar", "./common"], function($, sidebar, common) {
  $(document).ready(function() {
    $("#info_textarea").on("input", function() {
      var inputs = marked($("#info_textarea").val());
      inputs = common.LinkNorm(inputs);
      $("#info_preview")[0].innerHTML = inputs;
    });

    $("#info_submit").on("click", function() {
      var inputs = $("#info_textarea").val();
      sidebar.PostChat("homepage-info", inputs, function(data) {
        window.location.reload();
      });
    });

    common.LinkNormAll(".homepage_message");
    $(".homepage_message_edit").each(function() {
      var csrftoken = $("[name=csrfmiddlewaretoken]").val();
      var pk = $(this).attr("value");
      var target = $(this).attr("target");
      $(this).on("click", function() {
        $.post(
          common.urls.mondai_edit_api,
          { csrfmiddlewaretoken: csrftoken, pk: pk, target: target },
          function(data) {
            $("#message_edit_modal_body").html(
              `<textarea id="message_edit_modal_content">${data.content}</textarea>`
            );
            $("#message_edit_modal_content").attr("target", target);
            $("#message_edit_modal_content").attr("value", pk);
          }
        );
      });
    });
  });
});
