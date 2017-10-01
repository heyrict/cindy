from django.core.paginator import Paginator

from .models import Lobby


def lobby_chatlist(request):
    chatpage = request.GET.get('chatpage')
    try:
        chatpage = int(chatpage)
    except:
        chatpage = 1
    channel = request.GET.get('channel')  # leave it for future channel use

    chatlist = Paginator(Lobby.objects.order_by('-id'), 5)
    context = {'chatlist': chatlist.page(chatpage)}
    return context
