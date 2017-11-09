import os; os.environ.setdefault("DJANGO_SETTINGS_MODULE", "cindy.settings")
from datetime import timedelta

import django; django.setup()
from django.utils import timezone

from scoring import update_user_exp
from sui_hei.models import Lobby, Mondai


def clean_recent_lobby(recent=None):
    if not isinstance(recent, int):
        return

    count = Lobby.objects.filter(channel="lobby").count()
    if count < recent:
        return

    try:
        earliest = Lobby.objects.filter(channel="lobby")[count - recent].id
    except IndexError:
        return

    Lobby.objects.filter(channel="lobby", id__lt=earliest).delete()


def mark_mondai_as_dazed(recent=7):
    now = timezone.now()
    recent_days_ago = now - timedelta(days=recent)
    unsolved = Mondai.objects.filter(
        status=0, modified__lt=recent_days_ago)
    for dazed_mondai in unsolved:
        print("Mark dazed: ", dazed_mondai.id, "-", dazed_mondai.title)
        dazed_mondai.status = 2
        dazed_mondai.modified = now
        dazed_mondai.save()


# Update user experience
update_user_exp(recent=timedelta(days=3))

# delete old lobby chat messages
clean_recent_lobby(200)

# mark outdated mondais as dazed
mark_mondai_as_dazed(7)
