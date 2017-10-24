import os
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "cindy.settings")
import django
django.setup()
from datetime import timedelta
from scoring import update_user_exp

update_user_exp(recent=timedelta(days=3))
