from sui_hei.models import User
for u in User.objects.all():
    u.current_award = None
    u.save()
