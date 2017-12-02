from django.conf.urls import include, url
from django.contrib.auth import views as auth_views
from django.db.models import Count, Sum

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
    url(r'^users/', include('django.contrib.auth.urls')),
    url(r'^i18n/', include('django.conf.urls.i18n')),
    url(r"^users/add$", views.users_add, name="register"),
    url(r"^users/password_change$", views.password_change, name="password_change"),
    #url(r"^users/password_reset$", views.password_reset, name="password_reset"),
    url(r"^$", views.index, name="index"),
    url(r"^lobby/chat$", views.lobby_chat, name="lobby_chat"),
    url(r"^lobby/channel$", views.lobby_channel, name="lobby_channel"),
    url(r"^mondai$", views.mondai, name="mondai"),
    url(r"^mondai/add$", views.mondai_add, name="mondai_add"),
    url(r"^mondai/show/(?P<pk>[0-9]+)$", views.mondai_show, name="mondai_show"),
    url(r"^mondai/show/push_ques", views.mondai_show_push_ques, name="mondai_show_push_ques"),
    url(r"^mondai/show/push_answ", views.mondai_show_push_answ, name="mondai_show_push_answ"),
    url(r"^mondai/show/update_soup", views.mondai_show_update_soup, name="mondai_show_update_soup"),
    url(r"^mondai/show/star", views.mondai_star, name="mondai_star"),
    url(r"^mondai/show/remove_star", views.remove_star, name="mondai_star_remove"),
    url(r"^mondai/comment", views.mondai_comment, name="mondai_comment"),
    url(r"^profile/list", views.profile_list, name="profile_list"),
    url(r"^profile/(?P<pk>[0-9]+)$", views.profile, name="profile"),
    url(r"^profile/edit$", views.ProfileEdit.as_view(), name="profile_edit"),
    url(r"^profile/award_change", views.award_change, name="award_change"),
    url(r"^simple", views.simple, name="simple"),
    # TODO: Add pages to apply for & grant awards
    url(r"^api/useraward_list$", views.APIListProvider(UserAward).as_api, name="useraward_list_api"),
    url(r"^api/profile_list$", views.APIListProvider(User).as_api, name="profile_list_api"),
    url(r"^api/mondai_list$", views.APIListProvider(Mondai, lambda x: x.annotate(Count('star'))).as_api, name="mondai_list_api"),
    url(r"^api/mondai_edit$", views.mondai_edit_api, name="mondai_edit_api"),
    url(r"^api/star$", views.APIListProvider(Star).as_api, name="star_api"),
    url(r"^api/comment$", views.APIListProvider(Comment).as_api, name="comment_api"),
    url(r"^api/shitumon$", views.APIListProvider(Shitumon).as_api, name="shitumon_api"),
    url(r"^api/lobby$", views.APIListProvider(Lobby).as_api, name="lobby_api"),
    url(r"^api/mondai_show$", views.APIDetailProvider(Mondai).as_api, name="mondai_show_api"),
    url(r"^api/profile$", views.APIDetailProvider(User, profile_dataExtra).as_api, name="profile_api"),
]
# yapf: enable
