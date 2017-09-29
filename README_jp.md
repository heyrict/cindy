Cindy
=====
Djangoによるウミガメのスープ出題サイト『[ラテシン](http://sui-hei.net)』 のレプリカプロジェクトです。

プロジェクト名の由来は「シンディは死んでいない(Cindy Is Not Dead Yet)」
ラテシンの公式キャラクターである[シンディ](http://sui-hei.net/app/webroot/pukiwiki/index.php?%E3%82%B7%E3%83%B3%E3%83%87%E3%82%A3)から取っています。

**このプロジェクトは開発中です。皆さんの助けが必要です！**

開発環境
-----------
- [Python3.5](http://www.python.org)
- django and pymysql

    ```bash
    # Windowsの場合
    pip3 install django pymysql

    # Mac または Linux の場合
    sudo -H pip3 install django pymysql
    ```
- (Under Windows) mysqlclient

ローカルでの実行方法
------------------------------------
1. `git`をインストール済みなら、レポジトリをcloneしてください。
    なければ右上のボタンからzipをダウンロードしてください。
2. [必要な環境](#開発環境)
3. MySQL データベースを配置してください。
    - `cindy/mysql.cnf` をカスタマイズしてください。
    - open mysql, create a user and a database, grant all previlidges to it.

        ```sql
        # note that you need to chage all <>s to the value in your mysql.cnf.
        create database <database>;
        create user '<user>'@'<host>' identified by <password>;
        grant all on <database> to '<user>'@'<host>';
        quit
        ```
    - have django generate the database for you

        ```bash
        python3 manage.py makemigrations   # Alternatively, drag `manage.py` to the
        python3 manage.py migrate          # terminal to avoid `cd` operations.
        ```

4. localhost上でサーバーを起動してください。
    - Linux　か Mac の場合
        `cd` でクローン/解凍したディレクトリに移動してください。
        そのあと　`python3 manage.py runserver` を実行してください。
    - Windows の場合
        コマンドプロンプトで
        `python3 <ここに manage.py のアイコンをドラッグ> runserver`　を実行してください。
5. ターミナルに現れたリンクをブラウザで開いてください。

### ターミナルの開き方

#### Windows
For Windows users, hit `Win+R`, Input `cmd`, and hit enter.

#### Mac/Linux
Open app menu by hitting `Super` or `Win` on your keyboard,
or clicking the icon in your docker.

Search for `terminal`, and open it.

Under linux, you can open a terminal by hitting `Ctrl-Alt-T` or click th
e `open a terminal` in the right-click menu.

TODO
-----
1. 現段階ではほとんど空のプロジェクトです。協力をお待ちしています！
1. ロビーチャットのフロントエンドを改善する。
1. データベースをsuiheinetのように豊富する。
1. **レイアウトをもっと美しくデザインする**。
1. Q＆Aフレイムを追加する。

Contribute
----------
どんな形でもご協力を歓迎します！

`python` , `css` , `html`, のいずれかに詳しければ、遠慮なく [make your own changes](#コードを改善する) で変更してください！
`markdown` のスキルがあれば、 `README.md` も改善してください！

プログラミングが得意でなくても、アイデアがあれば [leave your comments](#issues-に投稿する)　までコメントをお願いします！

### Issues に投稿する
1. [issues page](https://github.com/heyrict/cindy/issues)　に移動してください。

1. `New Issue` ボタンを押してください。

1. コメントを投稿してください！

### コードを改善する
1. このプロジェクトをフォークしてください。

1. *your forked repo* をローカルにクローンしてください。

    `git clone http://github.com/your_user_name/your_folked_repo.git`


1. `develop` のようなブランチを作成してください。

    `git checkout -b name_of_your_new_branch`

1. 編集した後、 commit してください。

    ```bash
    # edit...
    git status  # check your edits
    git add -A  # add all updated files to cache
    git commit -m "your commit message"  # commit it
    git push origin name_of_your_new_branch
    ```

1.  プルリクエストしてください。


プログラマーズへ
----------------
This chapter is specially for explaning the whole project to programmers.

### データストラクチャー
```
.
├── cindy                           # メタデータをストアするフォルダです。
│   ├── __init__.py                 #  you may not need to edit it unless you
│   ├── settings.py                 #  know what you are doing.
│   ├── urls.py
│   └── wsgi.py
├── mysql.cnf                       # MySQLのコンフィグファイルです。
├── LICENSE                         # ライセンスファイルです。
├── manage.py                       # Djangoプロジェクトを管理するスクリプトです。
├── README.md                       # 英語版のREADMEです。日本語版より更新頻度が高いです。
├── README_jp.md                    # あなたが読んでいるこのファイルです。
├── locale/                         # folder storing language files
└── sui_hei                         # メインサイトプロジェクトをストアするフォルダです。
    ├── admin.py
    ├── apps.py                     # apps config file.
    ├── __init__.py
    ├── migrations/
    ├── models.py                   # テーブルストラクチャー(schema)をストアするファイルです。
    ├── static                      # スタチックファイルのフォルダです。e.g. css, js, png, etc.
    │   └── github-pandoc.css       #   イニシャルスタイルシートです。
    ├── templates                   # htmlファイルのテンプレートをストアするフォルダです。
    │   │── frames                  #   テンプレートのテンプレートをストアするフォルダです。
    │   │   └── header_n_footer.html#     general template containing header and footer.
    │   └── sui_hei                 #   html pages:
    │       ├── index.html          #     /sui_hei
    │       ├── lobby.html          #     /lobby
    │       ├── mondai.html         #     /mondai
    │       ├── mondai_show.html    #     /mondai/show/[0-9]+
    │       ├── profile.html        #     /profile/[0-9]+
    │       ├── users_add.html      #     /users/add
    │       └── users_login.html    #     /users/login
    ├── tests.py                    # プロジェクトテストに使うテストです。
    ├── urls.py                     # ウェブサイトのURLをコンファインするファイルです。
    └── views.py                    # テンプレートと変量からページを作るファイルです。
```

### トラブルシューティング

#### 最新のcommitをpullしましたが、データベースが正しく動作していないようだ
最新のcommitにsui_hei/models.pyが編集される場合があります。
この場合は手動的に以下のコマンドを実行する必要があります。

```bash
python3 manage.py makemigrations
python3 manage.py migrate
```

Contributers
------------
- 上杉
- [上３](https://github.com/pb10001)
