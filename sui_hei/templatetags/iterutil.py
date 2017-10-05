from django import template
import re

register = template.Library()

@register.filter
def inv(value):
    return value[::-1]

@register.filter
def startswith(value, head):
    if not (value and head):
        return False
    else:
        return value[:len(head)] == head
