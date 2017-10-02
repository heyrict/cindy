from django.contrib.auth.models import (AbstractBaseUser, AbstractUser,
                                        BaseUserManager)
from django.db import connections, models
from django.utils.translation import ugettext_lazy as _

# Create your models here.

#class SuiheiUserManager(BaseUserManager):
#    def create_user(self, username, nickname, password=None):
#        if not username:
#            raise ValueError(_("Username") + " " + _("is empty!"))
#        if not nickname:
#            raise ValueError(_("Nickname") + " " + _("is empty!"))
#
#        user = self.model(username=username, nickname=nickname)
#
#        user.set_password(password)
#        user.save()
#        return user
#
#    def create_superuser(self, username, nickname, password=None):
#        user = self.create_user(
#            username=username, nickname=nickname, password=password)
#        user.is_admin = True
#        user.save()
#        return user


class User(AbstractUser):
    #username = models.CharField(_('user_name'), max_length=150, unique=True)
    nickname = models.CharField(_('nick_name'), max_length=255, null=False)
    profile = models.TextField(_('profile'), default="")
    #is_active = models.BooleanField(default=True)
    #is_admin = models.BooleanField(default=False)

    #objects = SuiheiUserManager()

    #USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email', 'nickname']

    def get_full_name(self):
        return self.nickname

    def get_short_name(self):
        return self.nickname

    def __str__(self):
        return self.nickname


#    def has_perm(self, perm, obj=None):
#        return True
#
#    def has_module_perms(self, app_label):
#        return True
#
#    @property
#    def is_staff(self):
#        return self.is_admin


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
    title = models.CharField(max_length=255, null=False)
    yami = models.BooleanField(default=False, null=False)
    genre = models.IntegerField(default=0, null=False)
    content = models.TextField(null=False)
    kaisetu = models.TextField(null=False)
    seikai = models.BooleanField(null=False)
    created = models.DateTimeField(null=False)
    modified = models.DateTimeField(null=False)

    def __str__(self):
        return self.title


class Shitumon(models.Model):
    id = models.AutoField(max_length=11, null=False, primary_key=True)
    user_id = models.ForeignKey(User, db_column='user_id')
    mondai_id = models.ForeignKey(Mondai, db_column='mondai_id')
    shitumon = models.TextField(null=False)
    kaitou = models.TextField(null=True)
    askedtime = models.DateTimeField(null=False)
    answeredtime = models.DateTimeField(null=True)


class Lobby(models.Model):
    id = models.AutoField(max_length=11, null=False, primary_key=True)
    user_id = models.ForeignKey(User, db_column='user_id')
    content = models.TextField(null=False)
