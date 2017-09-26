from django.conf.urls import url

from . import views

app_name = "sui_hei"

urlpatterns = [
    url(r"^$", views.index, name="index"),
    url(r"^mondai$", views.mondai, name="index"),
]
