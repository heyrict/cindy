Cindy - login
=============

{% if error_message %}
**{{ error_message }}**
{% endif %}

<form action="{% url 'sui_hei:users_login' %}" method="post">
{% csrf_token %}
<table>{{ lf.as_table }}</table>
<input type="submit" value="Confirm" />
</form>
