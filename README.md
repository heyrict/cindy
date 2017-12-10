Cindy
=====
<img align="right" style="width:38.2%;" src="https://raw.githubusercontent.com/heyrict/cindy/master/sui_hei/static/pictures/cindylogo.png" />
A (non-)replica project for replicating the
website of [sui-hei.net](http://sui-hei.net) by `Django`.

The name of `Cindy` stands for **Cindy Is Not Dead Yet**,
which comes from the popular original character of
[Cindy](http://sui-hei.net/app/webroot/pukiwiki/index.php?%E3%82%B7%E3%83%B3%E3%83%87%E3%82%A3).

**THE PROJECT IS STILL UNDER CONSTRUCTION. WE URGE FOR YOUR SUPPORT!**

<div style="clear:both;" />

Requisitories
-----------
- [Python3.5](http://www.python.org)
- MySQL Server
- django, pymysql, markdown (python3 packages)

    ```bash
    # Windows
    pip3 install -r requirements.txt

    # Mac or Linux
    sudo -H pip3 install -r requirements.txt
    ```
- nodejs manager (npm or bower)

    ```bash
    cd cindy/sui_hei/static/js

    # Use npm (bower is somewhat alike)
    npm install

    # generate ./dist dir. run this command each time you edit the js files.
    # **Make Sure You are in `cindy/sui_hei/static/js` directory.**
    ./node_modules/.bin/webpack  # Linux
    node_modules\.bin\webpack.cmd  # Windows
    ```
- mysqlclient

    ```bash
    # Linux
    sudo apt-get install libmysqlclient20
    ```

How To Run This Site On Your Machine
------------------------------------
1. Clone this repo to your machine if you have `git`,
    otherwize download the zip archive by clicking the
    button up-right.
2. [Install requisitories](#requisitories).
    Make sure `python3` exists in your PATH.

3. Configure your MySQL database
    - customize `cindy/mysql.cnf` file. A template is [here](./mysql.cnf.template).
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

4. Run server on your localhost.
    - For Linux Users or Mac Users,
        `cd` to the root of the cloned/unzipped folder,
        and run `python3 manage.py runserver`.
    - For Windows Users,
        open a `cmd` window, and type
        `python3 <drag the manage.py here> runserver`
5. Open the link appeared in your terminal/cmd with a browser.

### How to open a terminal

#### Windows
For Windows users, hit `Win+R`, Input `cmd`, and hit enter.

#### Mac/Linux
Open app menu by hitting `Super` or `Win` on your keyboard,
or clicking the `all applications` icon in your dock.

Search for `terminal`, and open it.

Under linux, you can open a terminal by hitting `Ctrl-Alt-T` or click th
e `open a terminal` in the right-click menu.

TODO
-----
1. **A MORE BUILTIFUL LAYOUT**
1. Migrate this website to use react.
1. Add Pages (esp. wiki or something) for editing website on client side.
1. separate the forum to different languages.

Contribute
----------
All means of contributions are Welcome!

If you are familiar with `python` or `css` or `html`,
don't hesitate to [make your own changes](#improving-codes) to it!
You can even improve this `README.md` page if you have some `markdown` skills!

If you are not familiar with a programming language
but have some fastinating ideas, [leave your comments](#posting-issues)
for us!

### Posting Issues
1. Go to [issues page](https://github.com/heyrict/cindy/issues)

1. Press `New Issue` button.

1. Leave your comments!

### Improving codes
1. Fork this project.

1. Pull *your forked repo* to your local machine.

    `git clone http://github.com/your_user_name/your_folked_repo.git`


1. Create a new branch `develop` or something else
    like `a-new-feature` on your local machine.

    `git checkout -b name_of_your_new_branch`

1. Do some editing & commit it

    ```bash
    # edit...
    git status  # check your edits
    git add -A  # add all updated files to cache
    git commit -m "your commit message"  # commit it
    git push origin name_of_your_new_branch
    ```

1. Start a pull request

For Programmers
----------------
This chapter is specially for explaning the whole project to programmers.

### Data structure
```
.
├── cindy                                   # folder storing metadata for the project.
│   ├── __init__.py                         #  you may not need to edit it unless you
│   ├── settings.py                         #  know what you are doing.
│   ├── urls.py
│   └── wsgi.py
├── mysql.cnf.template                      # tempate of config of mysql. please
│                                           #  rename it to `mysql.cnf` for your preferences.
├── LICENSE                                 # licence file
├── manage.py                               # auto-generated manage script by django
├── README.md                               # the description file you are reading!
├── README_jp.md                            # the description file in Japanese
├── reset_database.sql                      # **warning**: you need to run this file
│                                           #  ONLY when you want to reset database.
├── locale/                                 # folder storing language files
└── sui_hei/                                # folder storing the main site project.
    ├── admin.py                            # modules visible in /admin
    ├── apps.py                             # apps config file.
    ├── context_processor.py                # generating global context
    ├── models.py                           # models storing data structure.
    ├── static                              # folder storing static files, e.g. css, js, png, etc.
    │   ├── css
    │   │   ├── base.css
    │   │   ├── mondai_show.css
    │   │   └── sidebar.css
    │   ├── js
    │   │   ├── app
    │   │   │   ├── base.js
    │   │   │   ├── common.js
    │   │   │   ├── index.js
    │   │   │   ├── leftbar_content.js
    │   │   │   ├── mondai_add.js
    │   │   │   ├── mondai.js
    │   │   │   ├── mondai_list.js
    │   │   │   ├── mondai_show.js
    │   │   │   ├── profile_edit.js
    │   │   │   ├── profile.js
    │   │   │   ├── profile_list.js
    │   │   │   └── sidebar.js
    │   │   ├── package.json
    │   │   └── webpack.config.js
    │   └── pictures
    │       ├── cindylogo.png
    │       ├── memobar.png
    │       ├── sidebar.png
    │       └── star.png
    ├── templates                           #  folder storing the template for authentiation
    │   ├── frames
    │   │   ├── base.html
    │   │   ├── footer.html
    │   │   ├── leftbar_content.html
    │   │   ├── pagination.html
    │   │   └── profile_child_navi.html
    │   ├── registration
    │   │   ├── add.html                    #   /users/add
    │   │   ├── login.html                  #   /users/login
    │   │   └── users_password_change.html  #   /users/change_password
    │   └── sui_hei                         #   /sui_hei
    │       ├── index.html                  #   /
    │       ├── mondai_add.html             #   /mondai/add
    │       ├── mondai.html                 #   /mondai
    │       ├── mondai_show.html            #   /mondai/show/[0-9]+
    │       ├── profile_edit.html           #   /profile/edit
    │       ├── profile.html                #   /profile/[0-9]+
    │       └── profile_list.html           #   /profile/list
    ├── templatetags                        # folder containing filters for template
    │   ├── decodes.py                      #  works like {{ var|filter }} in templates
    │   ├── __init__.py                     #
    │   ├── iterutil.py                     #
    │   └── markdown.py                     #
    ├── tests.py                            # file for testing the project
    ├── urls.py                             # url patterns of the website
    ├── views.py                            # create pages from templates. Pass variables here.
    └── translation.py
```

### Trouble Shooting

#### I pulled the latest commit but the database won't update
The latest commit may have some changes in sui_hei/models.py and
you have to update your local database manually by running

```bash
python3 manage.py makemigrations
python3 manage.py migrate
```

Contributers
------------
- [kamisugi(上杉)](http://sui-hei.net/mondai/profile/1)
- [kamisan(上参)](https://github.com/pb10001)
- [shakkuri(しゃっくり)](http://sui-hei.net/mondai/profile/11752)
- [sarubobo(さるぼぼ)](http://sui-hei.net/mondai/profile/6664)
