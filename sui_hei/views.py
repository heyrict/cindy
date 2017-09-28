from datetime import datetime

from django import forms
from django.http import Http404, HttpResponse, HttpResponseRedirect
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
    return HttpResponse(
        template.render({
            'mondai_list': mondai_list,
            'log_id': request.session.get('id', '')
        }, request))


def mondai_show(request, mondai_inst):
    template = loader.get_template('sui_hei/mondai_show.html')
    mondai_inst = get_object_or_404(Mondais, pk=mondai_inst)
    return HttpResponse(template.render({'mondai': mondai_inst}, request))


def profile(request, user_inst):
    template = loader.get_template('sui_hei/profile.html')
    user_inst = get_object_or_404(Users, pk=user_inst)
    return HttpResponse(template.render({'user': user_inst}, request))


# cindy/sui_hei/users/add
class RegisterForm(forms.Form):
    username = forms.CharField(max_length=255)
    name = forms.CharField(max_length=255)
    password = forms.CharField(max_length=255, widget=forms.PasswordInput)


def users_add(request):
    if request.method == "POST":
        rf = RegisterForm(request.POST)

        if rf.is_valid():
            username = rf.cleaned_data['username']
            name = rf.cleaned_data['name']
            password = rf.cleaned_data['password']

        # Validate the signup request
        try:
            # TODO: Validate the form here
            pass
        except:
            return render(request, 'sui_hei/users_add.html', {'rf': rf})

        # Create a new user
        user = Users(
            username=username,
            name=name,
            password=password,
            created=datetime.now(),
            modified=datetime.now())
        user.save()

        # Set the new user as log-in
        request.session['id'] = user.id

        # Redirect to homepage
        return HttpResponseRedirect('/mondai')
    return render(request, 'sui_hei/users_add.html', {'rf': RegisterForm()})


# cindy/sui_hei/users/login
class LoginForm(forms.Form):
    name = forms.CharField(max_length=255)
    password = forms.CharField(max_length=255, widget=forms.PasswordInput)


def users_login(request):
    if request.method == "POST":
        lf = LoginForm(request.POST)
        if lf.is_valid():
            name = lf.cleaned_data['name']
            password = lf.cleaned_data['password']

        # Validate the login request
        try:
            user_inst = get_object_or_404(Users, name=name, password=password)
        except Http404 as e:
            return render(request, 'sui_hei/users_login.html',
                          {'lf': lf,
                           'error_message': e})

        # Login succeed
        request.session['id'] = user_inst.id
        return HttpResponseRedirect('/mondai')
    else:
        return render(request, 'sui_hei/users_login.html', {'lf': LoginForm()})

def users_logout(request):
    try:
        del request.session['id']
    except:
        pass
    return HttpResponseRedirect('/mondai')
