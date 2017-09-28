Cindy - login
=============

{% if error_message %}
**{{ error_message }}**
{% endif %}

<form action="{% url 'sui_hei:users_login' %}" method="post">
{% csrf_token %}
{{ lf.as_p }}
<input type="submit" value="Confirm" />
</form>
