from django.shortcuts import render
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
