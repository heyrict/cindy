Cindy - mondai
==============

{% for mondai in mondai_list %}

- [{{ mondai.title }}](mondai/show/%7B%7B%20mondai.id%20%7D%7D)
    Syutudaisya: [{{ mondai.user_id.username }}](profile/%7B%7B%20mondai.user_id%20%7D%7D)

{% endfor %}
