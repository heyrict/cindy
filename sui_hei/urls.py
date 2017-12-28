from django.conf.urls import include
from django.contrib.auth import views as auth_views
from django.db.models import Count, Sum
from django.urls import path, re_path
from graphene_django.views import GraphQLView

from . import views
from .admin import *

app_name = "sui_hei"


def profile_dataExtra(prof):
    returns = dict()

    mondais = Mondai.objects.filter(user_id=prof.id)
    comments = Comment.objects.filter(user_id=prof.id)

    returns['mondai_count'] = mondais.count()
    put_ques = Shitumon.objects.filter(user_id=prof.id)
    returns['ques_count'] = put_ques.count()
    returns['goodques_count'] = put_ques.filter(good=True).count()
    returns['trueques_count'] = put_ques.filter(true=True).count()
    returns['comment_count'] = comments.count()

    return returns


# yapf: disable
urlpatterns = [
    path('i18n', include('django.conf.urls.i18n')),
    path('users', include('django.contrib.auth.urls')),
    # GraphQL
    path("graphql", GraphQLView.as_view(graphiql=True)),
    # rest
    re_path("^(mondai|profile)", views.simple, name="simple"),
    path("", views.simple, name="index"),
]
# yapf: enable
