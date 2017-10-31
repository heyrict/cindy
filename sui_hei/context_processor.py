from django.core.paginator import Paginator

from .models import Lobby


def lobby_chatlist(request):
    if 'lobby/channel' in request.META['PATH_INFO']:
        return {}

    # params
    chatpage = 1
    mode = "closed"
    channel = request.session.get('channel', 'lobby')

    chatlist = Paginator(Lobby.objects.filter(channel=channel).order_by('-id'), 10)
    context = {'chatlist': chatlist.page(chatpage), 'channel': channel}
    return context
