from sui_hei.models import *

comments = Lobby.objects.filter(channel__startswith="comments-").all()

for c in comments:
    commented_mondai = Mondai.objects.get(id=c.channel[len("comments-"):])
    user_id = c.user_id
    migrated = Comment.objects.get_or_create(
        user_id=user_id, mondai_id=commented_mondai, content=c.content)
    migrated[0].save()
