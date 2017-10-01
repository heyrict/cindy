from django import template

register = template.Library()

@register.filter
def inv(value):
    return value[::-1]
