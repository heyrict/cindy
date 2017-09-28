from datetime import datetime
from django import forms

from django.http import HttpResponse, HttpResponseRedirect, Http404
from django.shortcuts import get_object_or_404, render
from django.template import loader
from django.urls import reverse
from django.utils.translation import gettext_lazy as _

from .models import Chats, Mondais, Shitumons, Users


# Create your views here.
def index(request):
    template = loader.get_template('sui_hei/index.html')
    return HttpResponse(template.render({}, request))


def mondai(request):
    template = loader.get_template('sui_hei/mondai.html')
    mondai_list = Mondais.objects.order_by('-created')
    return HttpResponse(template.render({'mondai_list': mondai_list}, request))


def mondai_show(request, mondai_inst):
    template = loader.get_template('sui_hei/mondai_show.html')
    mondai_inst = get_object_or_404(Mondais, pk=mondai_inst)
    return HttpResponse(template.render({'mondai': mondai_inst}, request))


def profile(request, user_inst):
    template = loader.get_template('sui_hei/profile.html')
    user_inst = get_object_or_404(Users, pk=user_inst)
    return HttpResponse(template.render({'user': user_inst}, request))


class RegisterForm(forms.Form):
    username = forms.CharField()
    name = forms.CharField()
    password = forms.PasswordInput()

def users_add(request):
    template = loader.get_template('sui_hei/register.html')
    return HttpResponse(template.render({}, request))

def register(request):
    try:
        name = request.POST['name']
        username = request.POST['username']
        password = request.POST['password']
        if name == "":
            raise ValueError(_("Name is empty!"))
        if username == "":
            raise ValueError(_("Username is empty!"))
        if password == "":
            raise ValueError(_("Password is empty!"))
        if len(password) < 6:
            raise ValueError(
                _("Password is too short! You need at least 6 characters."))
    except ValueError as e:
        return render(request, 'sui_hei/register.html', {'error_message': e})
    else:
        user = Users(
            username=username,
            name=name,
            password=password,
            created=datetime.now(),
            modified=datetime.now())
        user.save()
        return HttpResponse(
            _("Successfully created a user account!"
              "Click <a href='/mondai'>here</a> to back to home page."))

def login(request):
    try:
        name = request.POST['name']
        password = request.POST['password']
        user_inst = get_object_or_404(Users, name=name, password=password)
    except Http404:
        return render(request, 'sui_hei/login.html', {'error_message': e})
    else:
        request.session['id'] = user_inst.id
        return HttpResponseRedirect('/')
