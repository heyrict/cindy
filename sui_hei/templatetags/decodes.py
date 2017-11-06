from django import template
from django.utils.translation import ugettext_lazy as _
from django.db.models import Count, Q
from ..models import mondai_genre_enum, mondai_status_enum

register = template.Library()

@register.filter
def mondai_genre(value):
    return mondai_genre_enum[value]

@register.filter
def mondai_status(value):
    return mondai_status_enum[value]

@register.filter
def normalize_star(value):
    return '%.1f' % value

@register.filter
def get_quescount(ques):
    unanswered = ques.filter(Q(kaitou="") | Q(kaitou__isnull=True))
    return {'ques': ques.count(), 'unanswered': unanswered.count()}
