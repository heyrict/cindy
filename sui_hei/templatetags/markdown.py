import re

from bs4 import BeautifulSoup
from django import template
from django.template.defaultfilters import stringfilter
from markdown import markdown as md

register = template.Library()


@stringfilter
@register.filter(is_safe=True)
def text2md(value):
    '''
    convert markdown-like text to html.
    strip header <p> and footer </p> if p is True.
    '''
    returns = BeautifulSoup(value, 'html5lib').prettify(encoding="utf8")
    returns = md(returns.decode('utf8'))
    return returns


@register.filter(is_safe=True)
@stringfilter
def line2md(value, p=True):
    returns = BeautifulSoup(value, 'html5lib').get_text()
    returns = re.sub("^([*+-]) ", r"\\\1 ", returns)
    returns = md(returns)
    if p: returns = returns[3:-4]
    return returns
