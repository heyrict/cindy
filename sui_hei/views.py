from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse
from django.template import loader
from .models import Mondais, Shitumons, Users, Chats

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
    user_inst = get_object_or_404(Users, name=user_inst)
    return HttpResponse(template.render({'user': user_inst}, request))
