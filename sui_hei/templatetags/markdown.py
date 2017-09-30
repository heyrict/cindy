from django import template
from django.template.defaultfilters import stringfilter
from markdown import markdown as md

register = template.Library()


@stringfilter
@register.filter(is_safe=True)
def text2md(value, p=False):
    '''
    convert markdown-like text to html.
    strip header <p> and footer </p> if p is True.
    '''
    returns = md(value)
    if p:
        returns = returns[3:-4]
    return returns
