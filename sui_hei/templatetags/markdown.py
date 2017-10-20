import re

from bs4 import BeautifulSoup
from django import template
from django.template.defaultfilters import stringfilter
from markdown import markdown as md
from markdown.extensions.headerid import HeaderIdExtension

register = template.Library()


@stringfilter
@register.filter(is_safe=True)
def text2md(value):
    '''
    convert markdown-like text to html.
    strip header <p> and footer </p> if p is True.
    '''
    returns = md(value, ['markdown.extensions.extra', HeaderIdExtension()])
    returns = BeautifulSoup(returns, 'html5lib').prettify()
    return returns


@register.filter(is_safe=True)
@stringfilter
def line2md(value, p=True):
    returns = BeautifulSoup(value, 'html5lib').get_text()
    returns = re.sub("([*+-]) ", r"\\\1 ", returns)     # prevent lists
    returns = re.sub(r"(\d+)\. ", r"\1\\. ", returns)
    returns = re.sub("([><])", r"\\\1", returns)        # prevent quotations
    returns = md(returns, ['markdown.extensions.extra'])
    if p and len(re.findall("<p>", returns)) < 2:
        returns = re.sub(r"(^<p>|</p>$)", "", returns)
    return returns
