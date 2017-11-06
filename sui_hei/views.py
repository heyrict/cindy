import re
from itertools import chain
from django.utils import timezone

from django import forms
from django.contrib.auth import authenticate, login, update_session_auth_hash
from django.contrib.auth.decorators import login_required, permission_required
from django.core.paginator import Paginator
from django.core.exceptions import ObjectDoesNotExist
from django.forms import ValidationError
from django.http import HttpResponseRedirect, HttpResponse, JsonResponse
from django.shortcuts import get_object_or_404, redirect, render, reverse
from django.utils.translation import ugettext_lazy as _
from django.utils.translation import LANGUAGE_SESSION_KEY
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import DetailView, ListView, UpdateView

import django_filters
from rest_framework import viewsets, filters

from .admin import *
from .models import *
from scoring import *
from .serializer import *

# Create your views here.
# /
# TODO: Change database related POSTs to javascript
def index(request):
    hpinfopage = request.GET.get('hpinfopage', 1)
    request.session['channel'] = 'lobby'
    comments = Lobby.objects.filter(channel__startswith="comments-").order_by("-id")[:15]
    mondais = []
    for i in comments:
        try:
            mondais.append(Mondai.objects.get(id=i.channel[len("comments-"):]))
        except ObjectDoesNotExist:
            continue

    infos = Lobby.objects.filter(
        channel="homepage-info").order_by('-id')
    hpinfo_list = Paginator(infos, 20)
    return render(request, 'sui_hei/index.html', {
        'comments': zip(comments, mondais),
        'infos': hpinfo_list.page(hpinfopage),
    })


# /mondai
class MondaiView(ListView):
    template_name = 'sui_hei/mondai.html'
    context_object_name = 'mondai_list'
    paginate_by = 20

    def get_queryset(self):
        # TODO: Add searching & filtering from request.GET
        # default behavior
        others = Mondai.objects.filter(status__gte=1).order_by('-modified').select_related()
        return others

    def get_context_data(self, **kwargs):
        self.request.session['channel'] = 'lobby'

        context = super(MondaiView, self).get_context_data(**kwargs)
        unsolved = Mondai.objects.filter(status__exact=0).order_by('-modified').select_related()
        context['unsolved_mondai_list'] = unsolved
        return context


# /mondai/show/[0-9]+
def mondai_show(request, pk):
    if request.method == "GET":
        # TODO: Add sorting for yami soup.
        request.session['channel'] = 'mondai-' + pk

        mondai = Mondai.objects.get(id=pk)
        qnas = Shitumon.objects.filter(mondai_id=mondai).order_by('id')

        # Check if current user has done some comments
        try:
            mycomment = Lobby.objects.get(
                channel="comments-%s" % pk, user_id=request.user)
        except:
            mycomment = None
        try:
            mystar = Star.objects.get(
                mondai_id=mondai, user_id=request.user).value
        except:
            mystar = 0

        return render(request, 'sui_hei/mondai_show.html', {
            'mondai': mondai,
            'qnas': qnas,
            'mycomment': mycomment,
            'mystar': mystar
        })
    else:
        return redirect(reverse("sui_hei:mondai"))


def mondai_star(request):
    if request.method == "POST" and request.user.is_authenticated:
        mondai = Mondai.objects.get(id=request.POST.get("mondai"))
        star = Star.objects.get_or_create(
            user_id=request.user, mondai_id=mondai)[0]
        star.value = float(request.POST.get('stars', 0))
        star.save()
        try: update_soup_score(star.mondai_id)
        except: pass
    return HttpResponse(True)


def mondai_show_push_answ(request):
    if request.method == "POST" and request.user.is_authenticated:
        try:
            to_update = {}
            for pk in request.POST.keys():
                if pk[:len('push_answ_')] == 'push_answ_':
                    pk = pk[len('push_answ_'):]
                    if pk not in to_update:
                        to_update[pk] = get_object_or_404(Shitumon, id=pk)
                    to_update[pk].kaitou = request.POST.get('push_answ_' + pk)
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
                obj.save()

            # Update Mondai's modified time
            mondai = re.findall("(?<=/mondai/show/)[0-9]+",
                                request.META['HTTP_REFERER'])[0]
            mondai_id = Mondai.objects.get(id=mondai)
            mondai_id.modified = timezone.now()
            mondai_id.save()

            # update user last active event
            request.user.last_login = timezone.now()
            request.user.save()
        except Exception as e:
            print("PushAnsw:", e)
    return redirect(request.META['HTTP_REFERER'].split('?', 1)[0])


def mondai_show_update_soup(request):
    if request.method == "POST" and request.user.is_authenticated:
        try:
            mondai_id = get_object_or_404(
                Mondai,
                id=re.findall(r"(?<=/mondai/show/)[0-9]+",
                              request.META['HTTP_REFERER'])[0])
            kaisetu = request.POST.get('change_kaisetu')
            seikai = request.POST.get('change_seikai')
            hidden = request.POST.get('toggle_status_hidden')
            yami = request.POST.get('toggle_yami')
            memo = request.POST.get('change_memo')

            # Validation
            if kaisetu == '': raise ValueError("Empty Input Data")

            # Update mondai
            if kaisetu and mondai_id.status == 0:
                mondai_id.kaisetu = kaisetu
            mondai_id.memo = memo
            if seikai:
                mondai_id.status = 1
                mondai_id.modified = timezone.now()
            if yami:
                mondai_id.yami = not mondai_id.yami
            if hidden and mondai_id.status in [0, 1]:
                mondai_id.status = 3
            elif hidden and mondai_id.status == 3:
                mondai_id.status = 1
            mondai_id.save()

            # TODO: Grant awards here

        except Exception as e:
            print("UpdateSoup:", e)
    return redirect(request.META['HTTP_REFERER'].split('?', 1)[0])


def shitumon_edit(request):
    pk = int(request.POST.get("pk"))
    target = request.POST.get("target")
    content = request.POST.get("content")

    if target in ["lobby", "homepage"]:
        inst = Lobby.objects.get(id=pk)
    elif target in ["shitumon", "kaitou"]:
        inst = Shitumon.objects.get(id=pk)
    else:
        return JsonResponse({'error_message': "Target unrecognized. Please report to administrator."})

    if content is not None:
        # validate, save message, return True
        error_message = None
        try:
            if target in ["lobby", "homepage"] and request.user == inst.user_id:
                if content == "":
                    inst.delete();
                else:
                    inst.content = content
                    inst.save()
            elif target == "shitumon" and request.user == inst.user_id:
                inst.shitumon = content
                inst.save()
            elif target == "kaitou" and request.user == inst.mondai_id.user_id:
                inst.kaitou = content
                inst.save()
            else:
                raise ValidationError(_("You are not permitted to do this!"))
        except ValidationError as e:
            error_message = e
        return JsonResponse({'error_message': error_message})
    else:
        if target in ["lobby", "homepage"]:
            return JsonResponse({'content': inst.content})
        elif target == "shitumon":
            return JsonResponse({'content': inst.shitumon})
        elif target == "kaitou":
            return JsonResponse({'content': inst.kaitou})
        else:
            return JsonResponse({'error_message': "Target unrecognized. Please report to administrator."})


def mondai_show_push_ques(request):
    if request.method == "POST" and request.user.is_authenticated:
        try:
            mondai_id = get_object_or_404(
                Mondai,
                id=re.findall(r"(?<=/mondai/show/)[0-9]+",
                              request.META['HTTP_REFERER'])[0])
            content = request.POST['push_ques']
            if content == '': raise ValueError("Empty Input Data")

            ques = Shitumon(
                user_id=request.user,
                shitumon=content.strip(),
                askedtime=timezone.now(),
                mondai_id=mondai_id)
            ques.save()

            # update user last active event
            request.user.last_login = timezone.now()
            request.user.save()
        except Exception as e:
            print("PushQues:", e)
    return redirect(request.META['HTTP_REFERER'].split('?', 1)[0])


# /lobby
def lobby_chat(request):
    # get current channel
    channel = request.POST.get('channel', 'lobby')

    # update
    if request.method == "POST" and request.user.is_authenticated:
        content = request.POST.get('push_chat', '')
        if content != '':
            chat = Lobby(
                user_id=request.user, content=content, channel=channel)
            chat.save()

        # render response
        chatlist = Paginator(
            Lobby.objects.filter(channel=channel).order_by('-id'), 10).page(1)
        return render(request, 'frames/leftbar_content.html', {
            'mode': 'open',
            'channel': channel,
            'chatlist': chatlist
        })

    referer_without_query = request.META['HTTP_REFERER'].split('?', 1)[0]
    return redirect(referer_without_query)


def lobby_channel(request):
    # change channel by submit button
    if request.method == "GET":
        chatpage = request.GET.get('chatpage', 1)
        channel = request.GET.get('channel', 'lobby')
        if not channel.strip(): channel = 'lobby'
        if channel == "homepage-info": channel = 'lobby'
        chatlist = Paginator(
            Lobby.objects.filter(channel=channel).order_by('-id'),
            10).page(chatpage)

        return render(request, 'frames/leftbar_content.html', {
            'mode': 'open',
            'channel': channel,
            'chatlist': chatlist
        })
    # change page by redirect
    else:
        return redirect(reverse("sui_hei:index"))


# /profile/[0-9]+
class ProfileView(DetailView):
    model = User
    template_name = 'sui_hei/profile.html'
    context_object_name = 'sui_hei_user'

    def get_context_data(self, **kwargs):
        context = super(ProfileView, self).get_context_data(**kwargs)

        # get latest 10 comments in relation to `sui_hei_user`
        userid = context['sui_hei_user'].id
        mondais = Mondai.objects.filter(user_id=userid)
        comments = Lobby.objects.filter(channel__in=[('comments-%s' % i.id)
                                                     for i in mondais])[:10]
        com_mondais = [Mondai.objects.get(id=i.channel[9:]) for i in comments]
        context['comments'] = zip(comments, com_mondais)
        context['pk'] = self.kwargs['pk']

        # get all awards
        if self.request.user.id == userid:
            available_awards = UserAward.objects.filter(user_id=userid)
        else:
            available_awards = []
        context['available_awards'] = available_awards

        # get statistics
        context['mondai_count'] = mondais.count()
        put_ques = Shitumon.objects.filter(user_id=userid)
        context['ques_count'] = put_ques.count()
        context['goodques_count'] = put_ques.filter(good=True).count()
        context['trueques_count'] = put_ques.filter(true=True).count()
        context['comment_count'] = Lobby.objects.filter(channel__startswith="comments-", user_id=userid).count()
        return context


# /profile/edit
class ProfileEdit(UpdateView):
    model = User
    template_name = 'sui_hei/profile_edit.html'
    fields = ['profile']

    def get_object(self):
        return self.request.user

    def get_success_url(self):
        return reverse("sui_hei:profile", kwargs={'pk': self.request.user.id})

    def form_valid(self, form):
        if re.findall(r'[^\]]*sui-hei.net/mondai/profile/[0-9]+',
                      str(form['profile'])):
            oldUserAward = Award.objects.get_or_create(name="☆ラテシンの使者")[0]
            grantOldUserAward = UserAward.objects.get_or_create(
                user_id=self.request.user, award_id=oldUserAward)[0]
            grantOldUserAward.save()
        return super(ProfileEdit, self).form_valid(form)


# /profile/mysoup/[0-9]+
class SelledSoupView(ListView):
    model = Mondai
    template_name = 'sui_hei/profile_selledsoup.html'
    context_object_name = 'mondai_list'
    paginate_by = 20

    def get_queryset(self):
        return self.model.objects.filter(
            user_id=self.kwargs['pk']).order_by('-id')

    def get_context_data(self, **kwargs):
        context = super(SelledSoupView, self).get_context_data(**kwargs)
        context['pk'] = self.kwargs['pk']
        return context


class MyStarView(ListView):
    model = Star
    template_name = 'sui_hei/profile_mystar.html'
    context_object_name = 'star_list'
    paginate_by = 20

    def get_queryset(self):
        return self.model.objects.filter(
            user_id=self.kwargs['pk']).order_by('-value')

    def get_context_data(self, **kwargs):
        context = super(MyStarView, self).get_context_data(**kwargs)
        context['pk'] = self.kwargs['pk']
        return context


# cindy/sui_hei/users/add
def users_add(request):
    if request.method == "POST":
        form = SuiheiUserCreationForm(request.POST)

        if form.is_valid():
            form.save()
            return redirect(reverse('sui_hei:login'))
        else:
            return render(request, 'registration/add.html', {'form': form})
    return render(request, 'registration/add.html',
                  {'form': SuiheiUserCreationForm()})


# /users/password_change
@login_required
def password_change(request):
    if request.method == "POST":
        form = SuiheiPasswordChangeForm(user=request.user, data=request.POST)
        if form.is_valid():
            form.save()
            update_session_auth_hash(request, form.user)
            return redirect(reverse("sui_hei:index"))
        else:
            return render(request, 'registration/users_password_change.html',
                          {'form': form})
    return render(request, 'registration/users_password_change.html',
                  {'form': SuiheiPasswordChangeForm(request.user)})


# /mondai/add
class MondaiAddForm(forms.Form):
    title = forms.CharField(label=_('Title'), max_length=255)
    genre = forms.IntegerField(
        label=_('Genre'),
        widget=forms.Select(choices=[
            (0, _("Albatross")),
            (1, _("20th-Door")),
            (2, _("Little Albat")),
            (3, _("Others & Formal")),
        ]))
    yami = forms.BooleanField(label=_('Yami'), required=False)
    content = forms.CharField(label=_('Content'), widget=forms.Textarea)
    kaisetu = forms.CharField(label=_('True Answer'), widget=forms.Textarea)


@login_required
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
            created = timezone.now()
            modified = timezone.now()

            _mondai = Mondai(
                title=title,
                yami=yami,
                genre=genre,
                content=content,
                kaisetu=kaisetu,
                status=0,
                user_id=userid,
                created=created,
                modified=modified, )
            _mondai.save()
            return redirect(reverse('sui_hei:mondai'))
        else:
            return render(request, 'sui_hei/mondai_add.html', {'form': form})
    return render(request, 'sui_hei/mondai_add.html',
                  {'form': MondaiAddForm()})


def set_language(request):
    if request.method == "POST":
        lang = request.POST.get('lang', 'en')
        request.session[LANGUAGE_SESSION_KEY] = lang
    return redirect(request.META['HTTP_REFERER'])


def award_change(request):
    if request.method == "POST":
        award_name = request.POST.get('award')
        award = Award.objects.get(name=award_name) if award_name else None
        request.user.current_award = award
        request.user.save()
    return redirect(request.META['HTTP_REFERER'])


def remove_star(request):
    if request.method == "POST":
        star_id = request.POST.get('star_id')
        try:
            star = Star.objects.get(id=star_id)

            # Validation
            if star.user_id != request.user:
                raise ValidationError(_("You are not permitted to delete others star!"))

        except Exception as e:
            return HttpResponse("RemoveStar:", e)
        star.delete()
    return HttpResponse(True)

class MondaiViewSet(viewsets.ModelViewSet):
    queryset = Mondai.objects.all()
    serializer_class = MondaiSerializer
