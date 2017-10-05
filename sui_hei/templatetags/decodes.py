from django import template
from django.utils.translation import ugettext_lazy as _

register = template.Library()

@register.filter
def genre(value):
    genred = dict([
        (0, _("Albatross")),
        (1, _("20th-Door")),
        (2, _("Little Albat")),
        (3, _("Others & Formal"))])
    return genred[value]

@register.filter
def normalize_star(value):
    return '%.1f' % ((value+5)*10)
