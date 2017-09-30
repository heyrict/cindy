import re
from datetime import datetime

from django import forms
from django.contrib.auth import authenticate, login, logout
from django.core.paginator import Paginator
from django.db.utils import IntegrityError
from django.forms import ValidationError
from django.http import Http404, HttpResponse, HttpResponseRedirect
from django.shortcuts import get_object_or_404, render
from django.template import loader
from django.utils.translation import ugettext_lazy as _
from django.views.generic import DetailView, ListView, UpdateView
from markdown import markdown as md

from .models import *


# Create your views here.
def index(request):
    log_id = request.session.get("id")
    template = loader.get_template('sui_hei/index.html')
    return HttpResponse(template.render({'log_id': log_id}, request))


class MondaiView(ListView):
    template_name = 'sui_hei/mondai.html'
    context_object_name = 'mondai_list'
    paginate_by = 20

    def get_context_data(self, **kwargs):
        context = super(MondaiView, self).get_context_data(**kwargs)
        context['log_id'] = self.request.session.get('id', '')
        return context

    def get_queryset(self):
        return Mondai.objects.order_by('-created')


class MondaiShowView(DetailView):
    model = Mondai
    template_name = 'sui_hei/mondai_show.html'
    context_object_name = 'mondai'


def lobby(request, page=1):
    if request.method == "POST" and request.user.is_authenticated:
        try:
            content = request.POST['push_chat']
            if content == '': raise ValueError("Empty Input Data")

            # Translate to markdown
            ## prevent markdown from translating * - + into lists
            content = re.sub("^([*+-]) ", r"\\\1 ", content)
            ## remove "^<p>" "</p>$"
            content = md(content)[3:-4]

            chat = Lobby(user_id=request.user, content=content)
            chat.save()
        except Exception as e:
            print(e)

    chatlist = Paginator(Lobby.objects.order_by('-id'), 20)
    return render(request, "sui_hei/lobby.html",
                  {'chatlist': chatlist.page(page)})


class ProfileView(DetailView):
    model = User
    template_name = 'sui_hei/profile.html'
    context_object_name = 'sui_hei_user'


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
            return HttpResponseRedirect('/sui_hei/users/login')
        else:
            return render(request, 'registration/add.html', {'form': form})
    return render(request, 'registration/add.html', {'form': RegisterForm()})


def users_logout(request):
    logout(request)
    return HttpResponseRedirect('/mondai')
