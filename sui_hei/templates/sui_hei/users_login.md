Cindy - login
=============

{% if error_message %}
**{{ error_message }}**
{% endif %}

<form action="{% url 'sui_hei:login' %}" method="post">
{% csrf_token %}
<p>{% if error_message %} <strong>{{ error_message }}</strong> {% endif %}</p>
<label>{% trans "User" %}</label>: <input type="text" name="name" id="name" /><br />
<label>{% trans "Password" %}</label>: <input type="password" name="password" id="password" /><br />
<input type="submit" value="Confirm" />
</form>
