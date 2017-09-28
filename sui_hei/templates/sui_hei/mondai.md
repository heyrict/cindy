Cindy - mondai
==============
[{% trans "register" %}](users/add)

{% trans "All Soups" %}
-----------------------

{% for mondai in mondai_list %}

- [{{ mondai.title }}](mondai/show/{{ mondai.id }})
    {% trans "Giver" %}: [{{ mondai.user_id.username }}](profile/{{ mondai.user_id.id }})

{% endfor %}
