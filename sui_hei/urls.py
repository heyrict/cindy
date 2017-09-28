from django.conf.urls import url

from . import views

app_name = "sui_hei"

urlpatterns = [
    url(r"^$", views.index, name="index"),
    url(r"^mondai$", views.MondaiView.as_view(), name="mondai"),
    url(r"^mondai/show/(?P<pk>[0-9]+)$", views.MondaiShowView.as_view(), name="mondai_show"),
    url(r"^profile/(?P<pk>[0-9]+)$", views.ProfileView.as_view(), name="profile"),
    url(r"^users/add$", views.users_add, name="users_add"),
    url(r"^users/login$", views.users_login, name="users_login"),
    url(r"^users/logout$", views.users_logout, name="users_logout"),
]
