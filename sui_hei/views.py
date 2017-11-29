import json
import re
from itertools import chain

from django import forms
from django.contrib.auth import authenticate, login, update_session_auth_hash
from django.contrib.auth.decorators import login_required, permission_required
from django.core.exceptions import ObjectDoesNotExist
from django.core.paginator import Paginator
from django.db.models import Count
from django.forms import ValidationError
from django.http import (Http404, HttpResponse, HttpResponseNotFound,
                         HttpResponseRedirect, JsonResponse)
from django.shortcuts import get_object_or_404, redirect, render, reverse
from django.utils import timezone
from django.utils.translation import ugettext_lazy as _
from django.utils.translation import LANGUAGE_SESSION_KEY
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import DetailView, ListView, UpdateView

from scoring import *

from .admin import *
from .models import *


# Create your views here.
# /
# TODO: Change database related POSTs to javascript
def index(request):
    hpinfopage = request.GET.get('hpinfopage', 1)
    comments = Comment.objects.order_by('-id')[:15]
    mondais = []

    infos = Lobby.objects.filter(channel="homepage-info").order_by('-id')
    hpinfo_list = Paginator(infos, 20)
    return render(request, 'sui_hei/index.html', {
        'comments': comments,
        'infos': hpinfo_list.page(hpinfopage),
    })


class APIListProvider(object):
    def __init__(self, baseClass, queryExtra=None):
        '''
        Initialize an APIProvider.

        Parameters
        ----------
        baseClass: class. The base class for querying
        queryExtra: function.
        '''
        self.baseClass = baseClass
        self.queryExtra = queryExtra

    def query(self, filter, order):
        objectList = self.baseClass.objects.select_related()
        if self.queryExtra:
            objectList = self.queryExtra(objectList)

        if filter:
            filter = json.loads(filter)
            objectList = objectList.filter(**filter)
        if order:
            objectList = objectList.order_by(order)

        return objectList

    def to_dict(self, queryDict, items_per_page, page):
        if items_per_page:
            items_per_page = int(items_per_page)
            page = int(page)
            paginator = Paginator(queryDict, items_per_page)

            # check whether any object exists.
            if paginator.count <= 0:
                return {"page": page, "num_pages": 0}
            else:
                # normalize page number:
                #   page = page <= 0 ? page : 1
                #   page = page > max_pagenum ? max_pagenum : page
                page = min(max(1, page), paginator.num_pages)
                returns = {
                    "page": page,
                    "num_pages": paginator.num_pages,
                    "data": [m.stringify_meta() for m in paginator.page(page)]
                }
        # don't need paginator
        else:
            returns = {"data": [m.stringify_meta() for m in queryDict]}

        return returns

    def as_api(self, request):
        '''
        API for getting objects.

        Parameters
        ----------
        items_per_page: int, or None if no paginator is wanted.
        page: int, defaults to 1. Works only when `items_per_page` is set.
        filter: dict, or None if no filtering is wanted.
        order: str, or None if no order_by is wanted.
        '''
        # get requested page number
        filter = request.POST.get("filter")
        order = request.POST.get("order")
        objectList = self.query(filter, order)

        # need paginator
        page = int(request.POST.get("page", 1))
        items_per_page = request.POST.get("items_per_page")

        return JsonResponse(self.to_dict(objectList, items_per_page, page))


class APIDetailProvider(object):
    def __init__(self, baseClass, dataExtra=None, **kwargs):
        '''
        Initialize an APIProvider.

        Parameters
        ----------
        baseClass: class. The base class for querying
        kwargs: keyword arguments will be passed on to stringify
        '''
        self.baseClass = baseClass
        self.dataExtra = dataExtra
        self.stringify_options = kwargs

    def to_dict(self, obj):
        data = obj.stringify(**self.stringify_options)
        if self.dataExtra:
            data.update(self.dataExtra(obj))
        return {"data": data}

    def as_api(self, request):
        '''
        API for getting objects.

        Parameters
        ----------
        id: int, the id to get for the baseClass.
        order: str, or None if no order_by is wanted.
        '''
        # get requested page number
        id = request.POST.get("id")
        objectList = self.baseClass.objects.select_related()
        obj = get_object_or_404(objectList, id=id)

        return JsonResponse(self.to_dict(obj))


def mondai(request):
    return render(request, "sui_hei/mondai.html")


def profile_list(request):
    return render(request, "sui_hei/profile_list.html")


# /mondai/show/[0-9]+
def mondai_show(request, pk):
    # TODO: Add sorting for yami soup.
    return render(request, 'sui_hei/mondai_show.html')


def mondai_star(request):
    if request.method == "POST" and request.user.is_authenticated:
        mondai = Mondai.objects.get(id=request.POST.get("mondai"))
        star = Star.objects.get_or_create(
            user_id=request.user, mondai_id=mondai)[0]
        star.value = float(request.POST.get('stars', 0))
        star.save()
        try:
            update_soup_score(star.mondai_id)
        except Exception as e:
            return JsonResponse({"error_message": str(e)})
    return JsonResponse({})


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


def mondai_edit_api(request):
    pk = int(request.POST.get("pk"))
    target = request.POST.get("target")
    content = request.POST.get("content")

    if target in ["lobby", "homepage"]:
        inst = Lobby.objects.get(id=pk)
    elif target in ["shitumon", "kaitou"]:
        inst = Shitumon.objects.get(id=pk)
    elif target == "comment":
        inst = Comment.objects.get(id=pk)
    else:
        return JsonResponse({
            'error_message':
            "Target unrecognized. Please report to administrator."
        })

    if content is not None:
        # validate, save message, return True
        error_message = None
        try:
            if target in ["lobby", "homepage", "comment"
                          ] and request.user == inst.user_id:
                if content == "":
                    inst.delete()
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
            error_message = str(e)
        return JsonResponse({'error_message': error_message})
    else:
        if target in ["lobby", "homepage", "comment"]:
            return JsonResponse({'content': inst.content})
        elif target == "shitumon":
            return JsonResponse({'content': inst.shitumon})
        elif target == "kaitou":
            return JsonResponse({'content': inst.kaitou})
        else:
            return JsonResponse({
                'error_message':
                "Target unrecognized. Please report to administrator."
            })


def mondai_show_push_ques(request):
    if request.method == "POST" and request.user.is_authenticated:
        content = request.POST['push_ques']
        if content == '':
            return JsonResponse({})

        mondai_id = get_object_or_404(
            Mondai,
            id=re.findall(r"(?<=/mondai/show/)[0-9]+",
                          request.META['HTTP_REFERER'])[0])

        ques = Shitumon(
            user_id=request.user,
            shitumon=content.strip(),
            askedtime=timezone.now(),
            mondai_id=mondai_id)
        ques.save()

        # update user last active event
        request.user.last_login = timezone.now()
        request.user.save()
    return JsonResponse({})


def mondai_comment(request):
    try:
        mondai = get_object_or_404(Mondai, id=request.POST["mondai_id"])
        content = request.POST.get("content")
        if not content:
            raise ValidationError("Content is blank!")

        comment = Comment.objects.get_or_create(
            user_id=request.user, mondai_id=mondai)[0]
        comment.content = content
        comment.save()

        return JsonResponse({})
    except Exception as e:
        return JsonResponse({'error_message': str(e)})


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
def profile(request, pk):
    return render(request, "sui_hei/profile.html", {"pk": pk})


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
        # Deprecated, will be removed in future.
        if re.findall(r'[^\]]*sui-hei.net/mondai/profile/[0-9]+',
                      str(form['profile'])):
            oldUserAward = Award.objects.get_or_create(name_ja="☆ラテシンの使者")[0]
            grantOldUserAward = UserAward.objects.get_or_create(
                user_id=self.request.user, award_id=oldUserAward)[0]
            grantOldUserAward.save()
        return super(ProfileEdit, self).form_valid(form)


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


def award_change(request):
    if request.method == "POST":
        useraward_id = request.POST.get('useraward')
        useraward = UserAward.objects.get(id=useraward_id) if useraward_id else None
        request.user.current_award = useraward
        request.user.save()
    return redirect(request.META['HTTP_REFERER'])


def remove_star(request):
    star_id = request.POST.get('star_id')
    try:
        star = Star.objects.get(id=star_id)

        # Validation
        if star.user_id != request.user:
            raise ValidationError(
                _("You are not permitted to delete others star!"))

        star.delete()

        # update soup score
        update_soup_score(star.mondai_id)

    except Exception as e:
        return JsonResponse({"error_message": str(e)})
    return JsonResponse({})
