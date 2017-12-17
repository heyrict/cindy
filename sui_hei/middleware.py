from django.conf import settings
from django.core.cache import cache
from django.utils.deprecation import MiddlewareMixin

from sui_hei.models import User

ONLINE_THRESHOLD = getattr(settings, "ONLINE_THRESHOLD", 60 * 15)
ONLINE_MAX = getattr(settings, "ONLINE_MAX", 200)


def get_online_now(self):
    return User.objects.filter(id__in=self.online_now_ids or [])


class OnlineNowMiddleware(MiddlewareMixin):
    '''
    Maintains a list of users who hae interacted with the website recently.
    Their user IDs are available as `online_now_ids` on the request object.
    and their corresponding users are available (lazily) as the
    `online_now` property on the request object.

    Obtained from https://stackoverflow.com/questions/45520011/count-online-users-django
    '''

    def process_request(self, request):
        # First get the index
        uids = cache.get("online-now", [])

        # Perform the multiget on the individual online uid keys
        online_keys = ['online-%s' % u for u in uids]
        fresh = cache.get_many(online_keys).keys()
        online_now_ids = [int(k.replace('online-', '')) for k in fresh]

        # If the user is authenticated, add their id to the list
        if request.user.is_authenticated():
            uid = request.user.id
            # If their uid is already in the list, we want to bump it
            # to the top, so we remove the earlier entry.
            if uid in online_now_ids:
                online_now_ids.remove(uid)
            online_now_ids.append(uid)
            if len(online_now_ids) > ONLINE_MAX:
                del online_now_ids[0]

        # Attach our modifications to the request object
        request.__class__.online_now_ids = online_now_ids
        request.__class__.online_now = property(get_online_now)

        # Set the new cache
        cache.set('online-%s' % (request.user.pk), True, ONLINE_THRESHOLD)
        cache.set('online-now', online_now_ids, ONLINE_THRESHOLD)
