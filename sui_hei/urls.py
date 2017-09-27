from django.conf.urls import url

from . import views

app_name = "sui_hei"

urlpatterns = [
    url(r"^$", views.index, name="index"),
    url(r"^mondai$", views.mondai, name="mondai"),
    url(r"^mondai/show/(?P<mondai_inst>[0-9]+)$", views.mondai_show, name="mondai_show"),
    url(r"^profile/(?P<user_inst>.+)$", views.profile, name="profile"),
    url(r"^users/add$", views.users_add, name="users_add"),
    url(r"^users/add/register$", views.register, name="register"),
]
