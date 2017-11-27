from sui_hei.models import *

snipe = (
    (5, Award.objects.get_or_create(name_ja="千里眼")[0]),
    (20, Award.objects.get_or_create(name_ja="★イーグルアイ")[0]),
    (70, Award.objects.get_or_create(name_ja="★★サードアイ")[0]), )

sniped = (
    (3, Award.objects.get_or_create(name_ja="かすり傷")[0]),
    (15, Award.objects.get_or_create(name_ja="手負いの兵")[0]),
    (50, Award.objects.get_or_create(name_ja="蜂の巣")[0]),
    (100, Award.objects.get_or_create(name_ja="不死身")[0]),
    (200, Award.objects.get_or_create(name_ja="射撃演習場の的")[0]), )

soup = (
    (100, Award.objects.get_or_create(name_ja="100問出題")[0]),
    (200, Award.objects.get_or_create(name_ja="200問出題")[0]),
    (300, Award.objects.get_or_create(name_ja="300問出題")[0]),
    (500, Award.objects.get_or_create(name_ja="500問出題")[0]),
    (600, Award.objects.get_or_create(name_ja="600問出題")[0]),
    (800, Award.objects.get_or_create(name_ja="出題王")[0]),
    (1000, Award.objects.get_or_create(name_ja="出題皇帝")[0]),
    (1500, Award.objects.get_or_create(name_ja="出題悪魔")[0]),
    (2000, Award.objects.get_or_create(name_ja="出題魔王")[0]),
    (3000, Award.objects.get_or_create(name_ja="出題魔神")[0]), )

shitumon = (
    (1000, Award.objects.get_or_create(name_ja="1000回質問")[0]),
    (2000, Award.objects.get_or_create(name_ja="2000回質問")[0]),
    (3000, Award.objects.get_or_create(name_ja="3000回質問")[0]),
    (5000, Award.objects.get_or_create(name_ja="5000回質問")[0]),
    (6000, Award.objects.get_or_create(name_ja="6000回質問")[0]),
    (8000, Award.objects.get_or_create(name_ja="質問王")[0]),
    (10000, Award.objects.get_or_create(name_ja="質問皇帝")[0]),
    (15000, Award.objects.get_or_create(name_ja="質問天使")[0]),
    (20000, Award.objects.get_or_create(name_ja="質問大天使")[0]),
    (30000, Award.objects.get_or_create(name_ja="質問神")[0]), )

seikai = (
    (50, Award.objects.get_or_create(name_ja="探偵")[0]),
    (100, Award.objects.get_or_create(name_ja="名探偵")[0]),
    (200, Award.objects.get_or_create(name_ja="ホームズ(猫)")[0]),
    (300, Award.objects.get_or_create(name_ja="新一")[0]),
    (500, Award.objects.get_or_create(name_ja="小五郎")[0]),
    (800, Award.objects.get_or_create(name_ja="耕助")[0]),
    (1111, Award.objects.get_or_create(name_ja="★ポアロ")[0]),
    (2222, Award.objects.get_or_create(name_ja="★★コロンボ")[0]),
    (3333, Award.objects.get_or_create(name_ja="★★★ホームズ")[0]), )

good_ques = (
    (100, Award.objects.get_or_create(name_ja="ピン")[0]),
    (500, Award.objects.get_or_create(name_ja="矢印")[0]),
    (1000, Award.objects.get_or_create(name_ja="印")[0]),
    (2000, Award.objects.get_or_create(name_ja="しるべ")[0]),
    (3000, Award.objects.get_or_create(name_ja="座標")[0]),
    (5000, Award.objects.get_or_create(name_ja="羅針盤")[0]),
    (7000, Award.objects.get_or_create(name_ja="コンパス")[0]),
    (11111, Award.objects.get_or_create(name_ja="地図")[0]),
    (22222, Award.objects.get_or_create(name_ja="地球儀")[0]),
    (33333, Award.objects.get_or_create(name_ja="ポラリス")[0]), )


class SuiheiAwardJudger(object):
    def __init__(self, judge=None):
        '''
        judge: function to decide which award to grant to a given user.
               user as param, iterable with each object an instance of Award as output.
        '''
        if judge: self.judge = judge
        self.message = ""

    def _grant(self, user, award):
        '''grant award to user'''
        print("Grant", award, "to", user)
        self.message += "Grant" + str(award) + "to" + str(user) + "\n"
        UserAward.objects.get_or_create(user_id=user, award_id=award)

    def execute(self, user):
        award = self.judge(user)
        for a in award:
            self._grant(user, a)
        return self.message

    def execAll(self, users):
        for user in users:
            self.execute(user)
        return self.message


def _award_or_none(count, awards):
    for a in awards:
        if count >= a[0]:
            yield a[1]


def _soup_judge(user):
    soup_count = Mondai.objects.filter(user_id=user).count()
    return _award_or_none(soup_count, soup)


def _shitumon_judge(user):
    shitumon_count = Shitumon.objects.filter(user_id=user).count()
    return _award_or_none(shitumon_count, shitumon)


def _seikai_judge(user):
    seikai_count = Shitumon.objects.filter(user_id=user, true=True).count()
    return _award_or_none(seikai_count, seikai)


def _good_ques_judge(user):
    good_ques_count = Shitumon.objects.filter(user_id=user, good=True).count()
    return _award_or_none(good_ques_count, good_ques)


def _snipe_judge(user):
    true_ques = Shitumon.objects.filter(user_id=user, true=True)
    count = 0
    for q in true_ques:
        if (q.mondai_id.shitumon_set.order_by("id").first()
                and q.mondai_id.shitumon_set.order_by("id").first() == q):
            count += 1
    return _award_or_none(count, snipe)


def _sniped_judge(user):
    soups = Mondai.objects.filter(user_id=user)
    count = 0
    for s in soups:
        if (s.shitumon_set.order_by("id").first()
                and s.shitumon_set.order_by("id").first().true):
            count += 1
    return _award_or_none(count, sniped)


judgers = {
    "soup": SuiheiAwardJudger(judge=_soup_judge),
    "shitumon": SuiheiAwardJudger(judge=_shitumon_judge),
    "seikai": SuiheiAwardJudger(judge=_seikai_judge),
    "good_ques": SuiheiAwardJudger(judge=_good_ques_judge),
    "snipe": SuiheiAwardJudger(judge=_snipe_judge),
    "sniped": SuiheiAwardJudger(judge=_sniped_judge),
}
