Cindy - register
================
**{% trans "Welcome to Cindy, a real-time website for lateral thinking games!" %}**

{% trans "You can register to cindy free in one more step" %}

<form action="{% url 'sui_hei:users_add' %}" method="post">
{% csrf_token %}
{{ rf.as_p }}
<input type="submit" value="Confirm" />
</form>
