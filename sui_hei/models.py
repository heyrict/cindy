from django.contrib.auth.models import (AbstractBaseUser, AbstractUser,
                                        BaseUserManager)
from django.db import connections, models
from django.db.models import Q
from django.utils.translation import ugettext_lazy as _


# Create your models here.
class Award(models.Model):
    name = models.CharField(max_length=255, null=False)
    description = models.TextField(default="")

    class Meta:
        verbose_name = _("Award")

    def __str__(self):
        return self.name

    def stringify(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description
        }

    def stringify_meta(self):
        return {"id": self.id, "name": self.name}


class User(AbstractUser):
    nickname = models.CharField(_('nick_name'), max_length=255, null=False, unique=True)
    profile = models.TextField(_('profile'), default="")
    current_award = models.ForeignKey(Award, null=True)
    experience = models.IntegerField(_('experience'), default=0)

    REQUIRED_FIELDS = ['nickname']

    def get_full_name(self):
        return self.nickname

    def get_short_name(self):
        return self.nickname

    def __str__(self):
        return self.nickname

    def stringify(self):
        if self.current_award:
            current_award_str = self.current_award.stringify_meta()
        else:
            current_award_str = None

        available_awards = [
            ua.award_id.stringify_meta()
            for ua in UserAward.objects.filter(user_id=self)
        ]
        return {
            "id": self.id,
            "nickname": self.nickname,
            "profile": self.profile,
            "current_award": current_award_str,
            "available_awards": available_awards,
            "experience": self.experience,
            "username": self.username
        }

    def stringify_meta(self):
        if self.current_award:
            current_award_str = self.current_award.stringify_meta()
        else:
            current_award_str = None
        return {
            "id": self.id,
            "nickname": self.nickname,
            "current_award": current_award_str,
            "experience": self.experience,
            "username": self.username,
            "date_joined": self.date_joined
        }


class UserAward(models.Model):
    user_id = models.ForeignKey(User)
    award_id = models.ForeignKey(Award)

    class Meta:
        verbose_name = _("User-Award")

    def __str__(self):
        return "[%s] owns [%s]" % (self.user_id.nickname, self.award_id)

    def stringify_meta(self):
        return {
            "user_id": self.user_id.stringify_meta(),
            "award_id": self.award_id.stringify_meta()
        }


class Mondai(models.Model):
    '''
    genre:
      0: umigame
      1: tobira
      2: kameo
      3: shin-keshiki
    '''
    id = models.AutoField(max_length=11, null=False, primary_key=True)
    user_id = models.ForeignKey(User, db_column='user_id')
    title = models.CharField(_('title'), max_length=255, null=False)
    yami = models.BooleanField(_('yami'), default=False, null=False)
    genre = models.IntegerField(_('genre'), default=0, null=False)
    content = models.TextField(_('content'), null=False)
    kaisetu = models.TextField(_('kaisetu'), null=False)
    created = models.DateTimeField(_('created'), null=False)
    modified = models.DateTimeField(_('modified'), null=False)
    status = models.IntegerField(_('status'), default=0, null=False)
    memo = models.TextField(_('memo'), default="")
    score = models.FloatField(_('score'), default=0, null=False)

    class Meta:
        verbose_name = _("Soup")

    def __str__(self):
        return self.title

    def stringify(self):
        return {
            "id": self.id,
            "user_id": self.user_id.stringify_meta(),
            "title": self.title,
            "yami": self.yami,
            "genre": self.genre,
            "content": self.content,
            "kaisetu": self.kaisetu,
            "created": self.created,
            "modified": self.modified,
            "status": self.status,
            "memo": self.memo,
            "score": self.score
        }

    def stringify_meta(self):
        ques = Shitumon.objects.filter(mondai_id=self)
        unanswered = ques.filter(Q(kaitou__isnull=True) | Q(kaitou__exact=""))
        return {
            "id": self.id,
            "user_id": self.user_id.stringify_meta(),
            "title": self.title,
            "yami": self.yami,
            "genre": self.genre,
            "created": self.created,
            "modified": self.modified,
            "status": self.status,
            "score": self.score,
            "star_count": self.star_set.count(),
            "quescount_all": ques.count(),
            "quescount_unanswered": unanswered.count()
        }


mondai_genre_enum = {
    0: _("Albatross"),
    1: _("20th-Door"),
    2: _("Little Albat"),
    3: _("Others & Formal")
}

mondai_status_enum = {
    0: _("Unsolved"),
    1: _("Solved"),
    2: _("Dazed"),
    3: _("Hidden"),
    4: _("Forced Hidden")
}


class Shitumon(models.Model):
    id = models.AutoField(max_length=11, null=False, primary_key=True)
    user_id = models.ForeignKey(User, db_column='user_id')
    mondai_id = models.ForeignKey(Mondai, db_column='mondai_id')
    shitumon = models.TextField(_('shitumon'), null=False)
    kaitou = models.TextField(_('kaitou'), null=True)
    good = models.BooleanField(_('good_ques'), default=False, null=False)
    true = models.BooleanField(_('true_ques'), default=False, null=False)
    askedtime = models.DateTimeField(_('askedtime'), null=False)
    answeredtime = models.DateTimeField(_('answeredtime'), null=True)

    class Meta:
        verbose_name = _("Question")

    def __str__(self):
        return "[%s]%s: {%s} puts {%50s}" % (self.mondai_id.id, self.mondai_id,
                                             self.user_id, self.shitumon)

    def stringify_meta(self):
        return self.stringify()

    def stringify(self):
        return {
            "id": self.id,
            "user_id": self.user_id.stringify_meta(),
            "owner_id": self.mondai_id.user_id.stringify_meta(),
            "shitumon": self.shitumon,
            "kaitou": self.kaitou,
            "good": self.good,
            "true": self.true,
            "askedtime": self.askedtime,
            "answeredtime": self.answeredtime
        }


class Lobby(models.Model):
    id = models.AutoField(max_length=11, null=False, primary_key=True)
    user_id = models.ForeignKey(User, db_column='user_id')
    channel = models.TextField(_('channel'), default="lobby", null=False)
    content = models.TextField(_('content'), null=False)

    #score = models.SmallIntegerField(_('score'), default=50)

    class Meta:
        permissions = (
            ("can_add_info", _("Can add homepage info")),
            ("can_grant_award", _("Can grant awards to users")), )
        verbose_name = _("Lobby")

    def __str__(self):
        return "[%s]: {%s} puts {%50s}" % (self.channel, self.user_id,
                                           self.content)

    def stringify_meta(self):
        return self.stringify()

    def stringify(self):
        return {
            "id": self.id,
            "user_id": self.user_id.stringify_meta(),
            "channel": self.channel,
            "content": self.content
        }


class Comment(models.Model):
    user_id = models.ForeignKey(User, db_column='user_id')
    mondai_id = models.ForeignKey(Mondai, db_column='mondai_id')
    content = models.TextField(_('content'), null=False)
    spoiler = models.BooleanField(_('spoiler'), default=False)

    class Meta:
        verbose_name = _("Comment")

    def __str__(self):
        return "{%s} commented on {%s}" % (self.user_id, self.mondai_id.title)

    def stringify_meta(self):
        return self.stringify()

    def stringify(self):
        return {
            "id": self.id,
            "user_id": self.user_id.stringify_meta(),
            "mondai_id": self.mondai_id.stringify_meta(),
            "content": self.content
        }


class Star(models.Model):
    user_id = models.ForeignKey(User, db_column='user_id')
    mondai_id = models.ForeignKey(Mondai, db_column='mondai_id')
    value = models.FloatField(_('Value'), null=False, default=0)

    class Meta:
        verbose_name = _("Star")

    def __str__(self):
        return "%s -- %.1f --> %s" % (self.user_id, self.value, self.mondai_id)

    def stringify_meta(self):
        return self.stringify()

    def stringify(self):
        return {
            "id": self.id,
            "user_id": self.user_id.stringify_meta(),
            "mondai_id": self.mondai_id.stringify_meta(),
            "value": self.value
        }
