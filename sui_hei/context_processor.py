from django.core.paginator import Paginator

from .models import Lobby


def lobby_chatlist(request):
    chatpage = request.GET.get('chatpage')

    # chatpage param
    try:
        chatpage = int(chatpage)
    except:
        chatpage = 1

    # mode param
    mode = request.GET.get('mode')
    if isinstance(mode, str) and mode == "open":
        pass
    else:
        mode = "closed"

    # channel param (to be added)
    channel = request.session.get('channel', 'lobby')

    chatlist = Paginator(Lobby.objects.filter(channel=channel).order_by('-id'), 10)
    context = {'chatlist': chatlist.page(chatpage), 'channel': channel}
    return context
