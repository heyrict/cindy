import re
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
        return Mondai.objects.order_by('seikai', '-created')

    def get_context_data(self, **kwargs):
        self.request.session['channel'] = 'lobby'
        return super(MondaiView, self).get_context_data(**kwargs)


# /mondai/show/[0-9]+
def mondai_show(request, pk):
    request.session['channel'] = 'mondai-'+pk
    mondai = Mondai.objects.get(id=pk)
    qnas = Shitumon.objects.filter(mondai_id=mondai).order_by('id')

    return render(request, 'sui_hei/mondai_show.html',
                  {'mondai': mondai,
                   'qnas': qnas})


def mondai_show_push_answ(request):
    if request.method == "POST" and request.user.is_authenticated:
        try:
            to_update = {}
            for pk in request.POST.keys():
                if pk[:len('push_answ_')] == 'push_answ':
                    pk = pk[len('push_answ_'):]
                    if pk not in to_update:
                        to_update[pk] = get_object_or_404(Shitumon, id=pk)
                    to_update[pk].kaitou = request.POST.get('push_answ_'+pk)
                elif pk[:len('check_goodques_')] == 'check_goodques_':
                    pk = pk[len('check_goodques_'):]
                    if pk not in to_update:
                        to_update[pk] = get_object_or_404(Shitumon, id=pk)
                    to_update[pk].good = not to_update[pk].good
                elif pk[:len('check_trueansw_')] == 'check_trueansw_':
                    pk = pk[len('check_trueansw_'):]
                    if pk not in to_update:
                        to_update[pk] = get_object_or_404(Shitumon, id=pk)
                    to_update[pk].true = not to_update[pk].true

            for _, obj in to_update.items():
                print(obj.good, obj.true)
                obj.save()
        except Exception as e:
            print("PushAnsw:", e)
    return redirect(request.META['HTTP_REFERER'].split('?', 1)[0])


def mondai_show_update_soup(request):
    if request.method == "POST" and request.user.is_authenticated:
        try:
            mondai_id = get_object_or_404(Mondai, id=request.GET.get('mondai'))
            kaisetu = request.POST['change_kaisetu']
            seikai = request.POST.get('change_seikai','off')
            if kaisetu == '': raise ValueError("Empty Input Data")

            mondai_id.kaisetu = kaisetu
            mondai_id.seikai = True if seikai=='on' else False
            mondai_id.save()
        except Exception as e:
            print("UpdateSoup:", e)
    return redirect(request.META['HTTP_REFERER'].split('?', 1)[0])


def mondai_change(request, table_name, field_name, pk):
    acceptable = {"Shitumon": Shitumon}
    if table_name in acceptable:
        try:
            obj2upd = get_object_or_404(acceptable[table_name], id=pk)

            # Validation
            if field_name == 'kaitou':
                if obj2upd.mondai_id.user_id != request.user:
                    raise ValidationError(
                        "You are not authenticated to access this page!")
            else:
                if obj2upd.user_id != request.user:
                    raise ValidationError(
                        "You are not authenticated to access this page!")

            if request.method == "POST":
                obj2upd.__setattr__(field_name, request.POST['push_change'])
                obj2upd.save()

                # Redirect to relavant page
                if table_name == "Shitumon":
                    return redirect(reverse("sui_hei:mondai_show",kwargs={'pk':obj2upd.mondai_id.id}))
                else:
                    return redirect(reverse("sui_hei:index"))
            else:
                return render(request, "sui_hei/mondai_change.html", {
                    'original': obj2upd.__getattribute__(field_name),
                    'table_name': table_name,
                    'field_name': field_name,
                    'pk': pk,
                })

        except Exception as e:
            return render(request, "sui_hei/mondai_change.html",
                          {'error_message': e})


def mondai_show_push_ques(request):
    if request.method == "POST" and request.user.is_authenticated:
        try:
            mondai_id = get_object_or_404(Mondai, id=request.GET.get('mondai'))
            content = request.POST['push_ques']
            if content == '': raise ValueError("Empty Input Data")

            ques = Shitumon(
                user_id=request.user,
                shitumon=content,
                askedtime=datetime.now(),
                mondai_id=mondai_id)
            ques.save()
        except Exception as e:
            print("PushQues:", e)
    return redirect(request.META['HTTP_REFERER'].split('?', 1)[0])


# /lobby
def lobby_chat(request):
    # get current channel
    channel = request.session.get['session', 'lobby']

    # update
    if request.method == "POST" and request.user.is_authenticated:
        try:
            content = request.POST.get('push_chat', '')
            if content != '':
                chat = Lobby(user_id=request.user, content=content, channel=channel)
                print(channel)
                chat.save()
        except Exception as e:
            print("Lobby:", e)
    referer_without_query = request.META['HTTP_REFERER'].split('?', 1)[0]
    return redirect(referer_without_query + "?chatpage=1&mode=open")


def lobby_channel(request):
    if request.methos == "POST":
        channel = request.POST.get('change_channel', 'lobby')
        channel = '-'.join(re.findall('\w+', channel))          # clear all symbols, e.g. @#$
        if not channel.strip(): channel = 'lobby'
        request.session['channel'] = channel
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
        return self.request.META['HTTP_REFERER']


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
        (3, _("Others & Formal")),
    ]))
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
    return render(request, 'sui_hei/mondai_add.html',
                  {'form': MondaiAddForm()})
