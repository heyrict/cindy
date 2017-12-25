import graphene
from django.db.models import Count, Q
from graphene import relay, resolve_only_args
from graphene_django.filter import DjangoFilterConnectionField
from graphene_django.types import DjangoObjectType

from .models import *


class UserNode(DjangoObjectType):
    class Meta:
        model = User
        filter_fields = ["username", "nickname"]
        interfaces = (relay.Node, )

    rowid = graphene.Int()

    def resolve_rowid(self, info):
        return self.id


class AwardNode(DjangoObjectType):
    class Meta:
        model = Award
        filter_fields = []
        interfaces = (relay.Node, )

    rowid = graphene.Int()

    def resolve_rowid(self, info):
        return self.id


class UserAwardNode(DjangoObjectType):
    class Meta:
        model = UserAward
        filter_fields = []
        interfaces = (relay.Node, )

    rowid = graphene.Int()

    def resolve_rowid(self, info):
        return self.id


class MondaiNode(DjangoObjectType):
    class Meta:
        model = Mondai
        filter_fields = []
        interfaces = (relay.Node, )

    rowid = graphene.Int()
    quesCount = graphene.Int()
    uaquesCount = graphene.Int()

    def resolve_rowid(self, info):
        return self.id

    def resolve_quesCount(self, info):
        return Shitumon.objects.filter(mondai=self).count()

    def resolve_uaquesCount(self, info):
        return Shitumon.objects.filter(
            Q(mondai=self) & (Q(kaitou__isnull=True)
            | Q(kaitou__exact=""))).count()


class ShitumonNode(DjangoObjectType):
    class Meta:
        model = Shitumon
        filter_fields = []
        interfaces = (relay.Node, )

    rowid = graphene.Int()

    def resolve_rowid(self, info):
        return self.id


class LobbyNode(DjangoObjectType):
    class Meta:
        model = Lobby
        filter_fields = []
        interfaces = (relay.Node, )

    rowid = graphene.Int()

    def resolve_rowid(self, info):
        return self.id


class CommentNode(DjangoObjectType):
    class Meta:
        model = Comment
        filter_fields = []
        interfaces = (relay.Node, )

    rowid = graphene.Int()

    def resolve_rowid(self, info):
        return self.id


class StarNode(DjangoObjectType):
    class Meta:
        model = Star
        filter_fields = []
        interfaces = (relay.Node, )

    rowid = graphene.Int()

    def resolve_rowid(self, info):
        return self.id


class Query(object):
    all_users = DjangoFilterConnectionField(UserNode)
    all_awards = DjangoFilterConnectionField(AwardNode)
    all_userawards = DjangoFilterConnectionField(UserAwardNode)
    all_mondais = DjangoFilterConnectionField(MondaiNode)
    all_shitumons = DjangoFilterConnectionField(ShitumonNode)
    all_lobbys = DjangoFilterConnectionField(LobbyNode)
    all_comments = DjangoFilterConnectionField(CommentNode)
    all_stars = DjangoFilterConnectionField(StarNode)

    user = relay.Node.Field(UserNode, id=graphene.Int())
    award = relay.Node.Field(AwardNode, id=graphene.Int())
    useraward = relay.Node.Field(UserAwardNode, id=graphene.Int())
    mondai = relay.Node.Field(MondaiNode, id=graphene.Int())
    shitumon = relay.Node.Field(ShitumonNode, id=graphene.Int())
    lobby = relay.Node.Field(LobbyNode, id=graphene.Int())
    comment = relay.Node.Field(CommentNode, id=graphene.Int())
    star = relay.Node.Field(StarNode, id=graphene.Int())

    def resolve_all_users(self, info, **kwargs):
        return User.objects.all()

    def resolve_all_awards(self, info, **kwargs):
        return Award.objects.all()

    def resolve_all_userawards(self, info, **kwargs):
        return UserAward.objects.all()

    def resolve_all_mondais(self, info, **kwargs):
        return Mondai.objects.select_related("shitumon").all()

    def resolve_all_shitumons(self, info, **kwargs):
        return Lobby.objects.all()

    def resolve_all_lobbys(self, info, **kwargs):
        return Lobby.objects.all()

    def resolve_all_comments(self, info, **kwargs):
        return Comment.objects.all()

    def resolve_all_stars(self, info, **kwargs):
        return Star.objects.all()

    def resolve_user(self, info, **kwargs):
        user_id = kwargs.get("id")
        if user_id is not None:
            return User.objects.get(pk=user_id)
        return None

    def resolve_award(self, info, **kwargs):
        award_id = kwargs.get("id")
        if award_id is not None:
            return Award.objects.get(pk=award_id)
        return None

    def resolve_useraward(self, info, **kwargs):
        useraward_id = kwargs.get("id")
        if useraward_id is not None:
            return UserAward.objects.get(pk=useraward_id)
        return None

    def resolve_mondai(self, info, **kwargs):
        mondai_id = kwargs.get("id")
        if mondai_id is not None:
            return Mondai.objects.get(pk=mondai_id)
        return None

    def resolve_shitumon(self, info, **kwargs):
        shitumon_id = kwargs.get("id")
        if shitumon_id is not None:
            return Lobby.objects.get(pk=shitumon_id)
        return None

    def resolve_lobby(self, info, **kwargs):
        lobby_id = kwargs.get("id")
        if lobby_id is not None:
            return Lobby.objects.get(pk=lobby_id)
        return None

    def resolve_comment(self, info, **kwargs):
        comment_id = kwargs.get("id")
        if comment_id is not None:
            return Comment.objects.get(pk=comment_id)
        return None

    def resolve_star(self, info, **kwargs):
        star_id = kwargs.get("id")
        if star_id is not None:
            return Star.objects.get(pk=star_id)
        return None


class UserConnection(graphene.Connection):
    class Meta:
        node = UserNode
