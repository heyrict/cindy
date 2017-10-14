# coding: utf-8
from sui_hei.models import *
import re
oldUserAward = Award.objects.get_or_create(name="☆ラテシンの使者")[0]
for user in User.objects.all():
    if re.findall(r'\([^\]]*sui-hei.net/mondai/profile/[0-9]+\)', str(user.profile)):
        grantOldUserAward = UserAward.objects.get_or_create(
            user_id=user,
            award_id=oldUserAward)[0]
        grantOldUserAward.save()

