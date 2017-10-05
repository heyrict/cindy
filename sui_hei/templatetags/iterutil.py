from django import template
import re

register = template.Library()

@register.filter
def inv(value):
    return value[::-1]

@register.filter
def startswith(value, head):
    return value[:len(head)] == head
