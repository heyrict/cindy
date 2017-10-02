from datetime import datetime

from django import forms
from django.contrib.auth import authenticate, login, logout
from django.core.paginator import Paginator
from django.db.utils import IntegrityError
from django.forms import ValidationError
from django.http import Http404, HttpResponse, HttpResponseRedirect
from django.shortcuts import get_object_or_404, redirect, render, reverse
from django.template import RequestContext, loader
from django.utils.translation import ugettext_lazy as _
from django.views.generic import DetailView, ListView, UpdateView
from markdown import markdown as md

from .models import *


# Create your views here.
# /
def index(request):
    return render(request, 'sui_hei/index.html')


# /mondai
class MondaiView(ListView):
    template_name = 'sui_hei/mondai.html'
    context_object_name = 'mondai_list'
    paginate_by = 20

    def get_queryset(self):
        return Mondai.objects.order_by('-created')


# /mondai/show/[0-9]+
class MondaiShowView(DetailView):
    model = Mondai
    template_name = 'sui_hei/mondai_show.html'
    context_object_name = 'mondai'


# /lobby
def lobby(request):
    #params = request.GET
    #paramlist = '&'.join(['%s=%s' % t for t in params])
    if request.method == "POST" and request.user.is_authenticated:
        try:
            content = request.POST['push_chat']
            if content == '': raise ValueError("Empty Input Data")

            chat = Lobby(user_id=request.user, content=content)
            chat.save()
        except Exception as e:
            print(e)
    referer_without_query = request.META['HTTP_REFERER'].split('?', 1)[0]
    return redirect(referer_without_query + "?chatpage=1&mode=open")


# /profile/[0-9]+
class ProfileView(DetailView):
    model = User
    template_name = 'sui_hei/profile.html'
    context_object_name = 'sui_hei_user'


# /profile/edit
class ProfileEdit(UpdateView):
    model = User
    template_name = 'sui_hei/profile_edit.html'
    fields = ['profile']

    def get_object(self):
        return self.request.user

    def get_success_url(self):
        return self.request.GET.get('next', '/mondai')


# cindy/sui_hei/users/add
class RegisterForm(forms.Form):
    nickname = forms.CharField(max_length=255)
    username = forms.CharField(max_length=255)
    email = forms.EmailField(max_length=255, widget=forms.TextInput)
    password = forms.CharField(max_length=255, widget=forms.PasswordInput)

    def clean(self):
        cleaned_data = super(RegisterForm, self).clean()
        _username = cleaned_data.get('username')
        _email = cleaned_data.get('email')
        if _username in [i.username for i in User.objects.iterator()]:
            self.add_error(
                'username',
                _("`{}` is already registered "
                  "by another user.\nTry another one!".format(_username)))
        if _email in [i.email for i in User.objects.iterator()]:
            self.add_error(
                'email',
                _("`{}` is already registered "
                  "by another user.\nTry another one!".format(_username)))


def users_add(request):
    if request.method == "POST":
        form = RegisterForm(request.POST)

        if form.is_valid():
            nickname = form.cleaned_data['nickname']
            username = form.cleaned_data['username']
            email = form.cleaned_data['email']
            password = form.cleaned_data['password']

            # Create a new user
            user = User.objects.create_user(
                username=username,
                nickname=nickname,
                email=email,
                password=password)
            user.save()

            # Redirect to homepage
            return redirect(reverse('sui_hei:login'))
        else:
            return render(request, 'registration/add.html', {'form': form})
    return render(request, 'registration/add.html', {'form': RegisterForm()})


# /users/logout
def users_logout(request):
    logout(request)
    return HttpResponseRedirect('/mondai')


# /mondai/add
class MondaiAddForm(forms.Form):
    title = forms.CharField(max_length=255)
    genre = forms.IntegerField(widget=forms.Select(choices=[
        (0, _("Albatross")),
        (1, _("20th-Door")),
        (2, _("Little Albat")),
        (3, _("Others & Formal")), ]))
    yami = forms.BooleanField(required=False)
    content = forms.CharField(widget=forms.Textarea)
    kaisetu = forms.CharField(widget=forms.Textarea)


def mondai_add(request):
    if request.method == "POST":
        form = MondaiAddForm(request.POST)

        if form.is_valid():
            title = form.cleaned_data['title']
            genre = form.cleaned_data['genre']
            yami = form.cleaned_data['yami']
            content = form.cleaned_data['content']
            kaisetu = form.cleaned_data['kaisetu']
            userid = request.user
            created = datetime.now()
            modified = datetime.now()

            _mondai = Mondai(
                title=title,
                yami=yami,
                genre=genre,
                content=content,
                kaisetu=kaisetu,
                seikai=0,
                user_id=userid,
                created=created,
                modified=modified, )
            _mondai.save()
            return redirect(reverse('sui_hei:mondai'))
        else:
            return render(request, 'sui_hei/mondai_add.html', {'form': form})
    return render(request, 'sui_hei/mondai_add.html', {'form': MondaiAddForm()})
