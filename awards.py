'''isort:skip_file'''
import os
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "cindy.settings")

import django
django.setup()
from django.utils import timezone
from django.db.models import Count

from sui_hei.models import *

BEST_OF_MONTH_GRANT_DAY = 15

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

star = (
    (5, Award.objects.get_or_create(
        name_ja="スターター",
        description_ja="他を知り己を知る。"
        "自らを高めるためには、他の問題を知る事も重要だ。"
        "君の好きな問題・面白いと思った問題・感動した問題、そんな問題にはスターを入れてみよう。"
        "そこが君のスタートラインだ。")[0]),
    (100, Award.objects.get_or_create(
        name_ja="ポスター",
        description_ja="彼のスター欄には様々な問題が展示されている。"
        "そのスター欄を眺めるだけでも一見の価値はあるだろう。")[0]),
    (300, Award.objects.get_or_create(
        name_ja="キャスター",
        description_ja="彼のスター欄は水平思考とは何かを物語っている。"
        "彼に「どういう問題が良問だと思う? 」と聞いてみよう。"
        "きっと嬉々として語ってくれるはずだ。")[0]),
    (500, Award.objects.get_or_create(
        name_ja="レジスター",
        description_ja="彼のスター欄には様々な問題が登録されている。"
        "「良い問題ってどうやって探せばいいんだろう…」。"
        "そんな時は彼のスター欄を覗きに行くと良い。"
        "選りすぐりの良問たちが君を出迎えてくれる。")[0]),
    (1000, Award.objects.get_or_create(
        name_ja="マイスター",
        description_ja="君はもはやスター名人である。"
        "しかし、水平思考に終わりはない。"
        "日夜良問とは何かについての考察や鍛錬を怠らず、良問を見つけてはスターを付ける。"
        "君の業績は尊敬に値するものである。")[0]),
    (2000, Award.objects.get_or_create(
        name_ja="クラスター",
        description_ja="君がスターをつけるのではない。"
        "良問が君の方に集まってくるのだ。"
        "Cindyで作られた良問たちが君を構成しているのだ。")[0]),
    (5000, Award.objects.get_or_create(
        name_ja="★",
        description_ja="君は気づいた。"
        "「そうだ。自分が星になれば良いんだ」。"
        "君の姿はいつまでもCindyで輝き続けるだろう。")[0]), )

best_of_month = (
    (1, Award.objects.get_or_create(name_ja="★鶴")[0]),
    (2, Award.objects.get_or_create(name_ja="★鶯")[0]),
    (3, Award.objects.get_or_create(name_ja="★燕")[0]),
    (4, Award.objects.get_or_create(name_ja="★蝶")[0]),
    (5, Award.objects.get_or_create(name_ja="★鰹")[0]),
    (6, Award.objects.get_or_create(name_ja="★蝸牛")[0]),
    (7, Award.objects.get_or_create(name_ja="★蝉")[0]),
    (8, Award.objects.get_or_create(name_ja="★鈴虫")[0]),
    (9, Award.objects.get_or_create(name_ja="★蜻蛉")[0]),
    (10, Award.objects.get_or_create(name_ja="★啄木鳥")[0]),
    (11, Award.objects.get_or_create(name_ja="★鷹")[0]),
    (12, Award.objects.get_or_create(name_ja="★狼")[0]), )


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
        ua, status = UserAward.objects.get_or_create(
            user_id=user, award_id=award)
        if status:
            print("Grant", award, "to", user)
            self.message += "Grant " + str(award) + " to " + str(user) + "\n"

    def execute(self, user):
        if self.judge:
            award = self.judge(user)
        else:
            award = []

        for a in award:
            self._grant(user, a)
        return self.message

    def execAll(self, users):
        for user in users:
            self.execute(user)
        return self.message


class SuiheiAwardTimedJudger(SuiheiAwardJudger):
    def __init__(self, day=None, weekday=None, month=None, *args, **kwargs):
        self.day = day
        self.weekday = weekday
        self.month = month
        super(SuiheiAwardTimedJudger, self).__init__(*args, **kwargs)

    def _time_is_ok(self):
        today = timezone.now()

        if self.day and self.day != today.day:
            return False
        if self.weekday and self.weekday != today.weekday:
            return False
        if self.month and self.month != today.month:
            return False

        return True

    def execute(self, *args, **kwargs):
        if self._time_is_ok():
            return super(SuiheiAwardTimedJudger, self).execute(*args, **kwargs)
        else:
            return ""

    def execAll(self, *args, **kwargs):
        if self._time_is_ok():
            return super(SuiheiAwardTimedJudger, self).execAll(*args, **kwargs)
        else:
            return ""


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


def _star_judge(user):
    star_count = Star.objects.filter(user_id=user).count()
    return _award_or_none(star_count, star)


judgers = {
    "soup": SuiheiAwardJudger(judge=_soup_judge),
    "shitumon": SuiheiAwardJudger(judge=_shitumon_judge),
    "seikai": SuiheiAwardJudger(judge=_seikai_judge),
    "good_ques": SuiheiAwardJudger(judge=_good_ques_judge),
    "snipe": SuiheiAwardJudger(judge=_snipe_judge),
    "sniped": SuiheiAwardJudger(judge=_sniped_judge),
    "star": SuiheiAwardJudger(judge=_star_judge),
}


def best_of_month_granter():
    # get current time
    today = timezone.now()

    # skip if is not the grant day
    if today.day != BEST_OF_MONTH_GRANT_DAY:
        return ""

    # get year & month of the previous month
    prevMonth = today.month - 1
    prevYear = today.year
    if prevMonth == 0:
        prevMonth = 12
        prevYear -= 1

    # get the best soup of the last month
    soupInPrevMonth = Mondai.objects.filter(
        created__month=prevMonth,
        created__year=prevYear).annotate(Count("star"))
    best_soup_of_last_month = soupInPrevMonth.order_by("-star__count").first()
    award_of_last_month = dict(best_of_month)[prevMonth]

    # if no soup found, return
    if not best_soup_of_last_month:
        return ""

    # grant award
    ua, status = UserAward.objects.get_or_create(
        user_id=best_soup_of_last_month.user_id, award_id=award_of_last_month)
    message = "Grant [" + str(award_of_last_month) + ']'\
              " to " + str(best_soup_of_last_month.user_id.nickname) + \
              " for soup <" + str(best_soup_of_last_month.title) + '>'\
              " got the most star count " + str(best_soup_of_last_month.star__count) + \
              " in " + best_soup_of_last_month.created.date().strftime("%Y/%m/%d") + '\n'
    print(message)
    return message


granters = {
    "best_of_month": best_of_month_granter,
}
