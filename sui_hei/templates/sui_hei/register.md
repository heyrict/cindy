Cindy - register
================
**{% trans "Welcome to Cindy, a real-time website for lateral thinking games!" %}**

{% trans "You can register to cindy free in one step" %}

{% if error_message %}
**{{ error_message }}**
{% endif %}

<form action="{% url 'sui_hei:register' %}" method="post">
{% csrf_token %}
<label>{% trans "Nickname" %}</label>: <input type="text" name="username" id="name" /><br />
<label>{% trans "User" %}</label>: <input type="text" name="name" id="username" /><br />
<label>{% trans "Password" %}</label>: <input type="password" name="password" id="password" /><br />
<input type="submit" value="Confirm" />
</form>
