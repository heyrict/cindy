from django.conf.urls import url
from django.conf.urls import include

from . import views

app_name = "sui_hei"

urlpatterns = [
    url(r'^users/', include('django.contrib.auth.urls')),
    url(r"^$", views.index, name="index"),
    url(r"^lobby$", views.lobby, name="lobby"),
    #url(r"^lobby/(?P<page>[0-9]+)$", views.lobby, name="lobby"),
    url(r"^mondai$", views.MondaiView.as_view(), name="mondai"),
    url(r"^mondai/add$", views.mondai_add, name="mondai_add"),
    url(r"^mondai/show/(?P<pk>[0-9]+)$", views.mondai_show, name="mondai_show"),
    url(r"^mondai/show/push_ques", views.mondai_show_push_ques, name="mondai_show_push_ques"),
    url(r"^mondai/show/push_answ", views.mondai_show_push_answ, name="mondai_show_push_answ"),
    url(r"^mondai/show/update_soup", views.mondai_show_update_soup, name="mondai_show_update_soup"),
    url(r"^mondai/edit/(?P<table_name>[a-zA-Z]+)/(?P<field_name>[a-zA-Z]+)/(?P<pk>[0-9]+)$", views.mondai_change, name="mondai_change"),
    url(r"^profile/(?P<pk>[0-9]+)$", views.ProfileView.as_view(), name="profile"),
    url(r"^profile/edit$", views.ProfileEdit.as_view(), name="profile_edit"),
    url(r"^users/add$", views.users_add, name="register"),
    #url(r"^users/login$", views.users_login, name="users_login"),
    #url(r"^users/logout$", views.users_logout, name="users_logout"),
]
