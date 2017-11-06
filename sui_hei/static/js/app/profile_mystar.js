require(["jquery", "../lib/bootstrap.min.js", "bootbox"], function($) {
  function init() {
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
              "{% url 'sui_hei:mondai_star_remove' %}",
              {
                csrfmiddlewaretoken: csrftoken,
                star_id: star_id
              },
              function(data) {
                if (data) {
                  location.reload();
                }
              }
            );
          }
        }
      );
    });
  }
  init();
});
