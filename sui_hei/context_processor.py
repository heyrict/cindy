from django.core.paginator import Paginator

from .models import Lobby


def lobby_chatlist(request):
    chatpage = request.GET.get('chatpage')
    if not isinstance(chatpage, int):
        chatpage = 1
    channel = request.GET.get('channel')  # leave it for future channel use

    chatlist = Paginator(Lobby.objects.order_by('id'), 20)
    context = {'chatlist': chatlist.page(chatpage)}
    return context
