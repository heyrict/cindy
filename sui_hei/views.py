from datetime import datetime

from django import forms
from django.db.utils import IntegrityError
from django.forms import ValidationError
from django.http import Http404, HttpResponse, HttpResponseRedirect
from django.shortcuts import get_object_or_404, render
from django.template import loader
from django.utils.translation import ugettext_lazy as _
from django.views.generic import DetailView, ListView

from .models import Chats, Mondais, Shitumons, Users


# Create your views here.
def index(request):
    template = loader.get_template('sui_hei/index.html')
    return HttpResponse(template.render({}, request))


def lobby(request):
    return render(request, "sui_hei/lobby.html", {})


class MondaiView(ListView):
    template_name = 'sui_hei/mondai.html'
    context_object_name = 'mondai_list'

    def get_context_data(self, **kwargs):
        context = super(MondaiView, self).get_context_data(**kwargs)
        context['log_id'] = self.request.session.get('id', '')
        return context

    def get_queryset(self):
        return Mondais.objects.order_by('-created')


class MondaiShowView(DetailView):
    model = Mondais
    template_name = 'sui_hei/mondai_show.html'
    context_object_name = 'mondai'

    def get_context_data(self, **kwargs):
        context = super(MondaiShowView, self).get_context_data(**kwargs)
        context['log_id'] = self.request.session.get('id', '')
        return context


class ProfileView(DetailView):
    model = Users
    template_name = 'sui_hei/profile.html'
    context_object_name = 'user'

    def get_context_data(self, **kwargs):
        context = super(ProfileView, self).get_context_data(**kwargs)
        context['log_id'] = self.request.session.get('id', '')
        return context


# cindy/sui_hei/users/add
class RegisterForm(forms.Form):
    username = forms.CharField(max_length=255)
    name = forms.CharField(max_length=255)
    password = forms.CharField(max_length=255, widget=forms.PasswordInput)

    def clean(self):
        cleaned_data = super(RegisterForm, self).clean()
        _name = cleaned_data.get('name')
        if _name in [i.name for i in Users.objects.iterator()]:
            self.add_error(
                'name',
                _("`{}` is already registered "
                  "by another user.\nTry another one!".format(_name)))


def users_add(request):
    if request.method == "POST":
        rf = RegisterForm(request.POST)

        if rf.is_valid():
            username = rf.cleaned_data['username']
            name = rf.cleaned_data['name']
            password = rf.cleaned_data['password']

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
        else:
            return render(request, 'sui_hei/users_add.html', {'rf': rf})
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
    except KeyError:
        pass
    return HttpResponseRedirect('/mondai')
