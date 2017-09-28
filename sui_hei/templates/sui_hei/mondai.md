Cindy - mondai
==============
{% if not log_id %}

[{% trans "register" %}](users/add)

[{% trans "login" %}](users/login)

{% else %}

[{% trans "logout" %}](users/logout)

{% endif %}

{% trans "All Soups" %}
-----------------------

{% for mondai in mondai_list %}

- [{{ mondai.title }}](mondai/show/{{ mondai.id }})
    {% trans "Giver" %}: [{{ mondai.user_id.username }}](profile/{{ mondai.user_id.id }})

{% endfor %}
