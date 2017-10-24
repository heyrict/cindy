import os
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "cindy.settings")
import django
django.setup()
from datetime import timedelta
from scoring import update_user_exp

from sui_hei.models import Lobby

def clean_recent_lobby(recent=None):
    if not isinstance(recent, int):
        return

    count = Lobby.objects.filter(channel="lobby").count()
    if count < recent:
        return

    try:
        earliest = Lobby.objects.filter(channel="lobby")[count-recent].id
    except IndexError:
        return

    Lobby.objects.filter(channel="lobby", id__lt=earliest).delete()


# Update user experience
update_user_exp(recent=timedelta(days=3))

# delete old lobby chat messages
clean_recent_lobby(200)
