from django.conf.urls import url
from django.contrib.auth import views as auth_views
from django.conf.urls import include

from . import views
from .admin import *

app_name = "sui_hei"

urlpatterns = [
    url(r'^users/', include('django.contrib.auth.urls')),
    url(r"^users/add$", views.users_add, name="register"),
    url(r"^users/password_change$", views.password_change, name="password_change"),
    #url(r"^users/password_reset$", views.password_reset, name="password_reset"),
    url(r"^$", views.index, name="index"),
    url(r"^lobby/chat$", views.lobby_chat, name="lobby_chat"),
    url(r"^lobby/channel$", views.lobby_channel, name="lobby_channel"),
    #url(r"^lobby/(?P<page>[0-9]+)$", views.lobby, name="lobby"),
    url(r"^mondai$", views.MondaiView.as_view(), name="mondai"),
    url(r"^mondai/add$", views.mondai_add, name="mondai_add"),
    url(r"^mondai/show/(?P<pk>[0-9]+)$", views.mondai_show, name="mondai_show"),
    url(r"^mondai/show/push_ques", views.mondai_show_push_ques, name="mondai_show_push_ques"),
    url(r"^mondai/show/push_answ", views.mondai_show_push_answ, name="mondai_show_push_answ"),
    url(r"^mondai/show/update_soup", views.mondai_show_update_soup, name="mondai_show_update_soup"),
    url(r"^mondai/show/star", views.mondai_star, name="mondai_star"),
    url(r"^mondai/show/remove_star", views.remove_star, name="mondai_star_remove"),
    url(r"^mondai/edit$", views.shitumon_edit, name="mondai_edit"),
    #url(r"^mondai/change/(?P<table_name>[a-zA-Z]+)/(?P<field_name>[a-zA-Z]+)/(?P<pk>[0-9]+)$", views.mondai_change, name="mondai_change"),
    url(r"^profile/(?P<pk>[0-9]+)$", views.ProfileView.as_view(), name="profile"),
    url(r"^profile/edit$", views.ProfileEdit.as_view(), name="profile_edit"),
    url(r"^profile/selledsoup/(?P<pk>[0-9]+)$", views.SelledSoupView.as_view(), name="profile_selledsoup"),
    url(r"^profile/mystar/(?P<pk>[0-9]+)$", views.MyStarView.as_view(), name="profile_mystar"),
    url(r"^profile/award_change", views.award_change, name="award_change"),
    url(r"^language$", views.set_language, name="set_language"),
    # TODO: Add pages to apply for & grant awards
]
