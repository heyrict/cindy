from django.db import models
from django.db import connections


# Create your models here.
class Users(models.Model):
    id = models.AutoField(max_length=11, null=False, primary_key=True)
    username = models.CharField(max_length=255, null=False)
    name = models.CharField(max_length=255, null=False)
    password = models.CharField(max_length=255, null=False)
    created = models.DateTimeField(null=False)
    modified = models.DateTimeField(null=False)

    def __str__(self):
        return self.name


class Mondais(models.Model):
    id = models.AutoField(max_length=11, null=False, primary_key=True)
    user_id = models.ForeignKey(Users, db_column='user_id')
    title = models.CharField(max_length=255, null=False)
    content = models.TextField(null=False)
    kaisetu = models.TextField(null=False)
    seikai = models.IntegerField(null=False)
    created = models.DateTimeField(null=False)
    modified = models.DateTimeField(null=False)

    def __str__(self):
        return self.title


class Chats(models.Model):
    id = models.AutoField(max_length=11, null=False, primary_key=True)
    user_id = models.ForeignKey(Users, db_column='user_id')
    mondai_id = models.ForeignKey(Mondais, db_column='mondai_id')
    content = models.TextField(null=False)
    created = models.DateTimeField(null=False)

    def __str__(self):
        return "%s: %s -> %s" % (id, self.user_id, self.mondai_id)

class Shitumons(models.Model):
    id = models.AutoField(max_length=11, null=False, primary_key=True)
    user_id = models.ForeignKey(Users, db_column='user_id')
    mondai_id = models.ForeignKey(Mondais, db_column='mondai_id')
    shitumon = models.TextField(null=False)
    kaitou = models.TextField(null=False)
    created = models.DateTimeField(null=False)
    modified = models.DateTimeField(null=False)

