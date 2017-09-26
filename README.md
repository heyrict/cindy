Cindy
=====
A (non-)replica project for replicating the
website of [sui-hei.net](http://sui-hei.net) by `Django`.

The name of `Cindy` stands for **Cindy Is Not Dead Yet**,
which comes from the popular original character of
[Cindy](http://sui-hei.net/app/webroot/pukiwiki/index.php?%E3%82%B7%E3%83%B3%E3%83%87%E3%82%A3).

**THE PROJECT IS STILL UNDER CONSTRUCTION. WE URGE FOR YOUR SUPPORT!**

Requirements
-----------
- [Python3.5](http://www.python.org)
- django and pymysql

How To Run This Site On Your Machine
------------------------------------
1. Clone this repo to your machine if you have `git`,
    otherwize download the zip archive by clicking the
    button up-right.
2. [Install requirements](#requirements)
3. run server on your localhost.
    - For Linux Users or Mac Users,
        `cd` to the root of the cloned/unzipped folder,
        and run `python3 manage.py runserver`.
    - For Windows Users,
        open a `cmd` window, and type
        `python3 <drag the manage.py here> runserver`
4. open the link appeared in your terminal/cmd with a browser.

### How to open a terminal

#### Windows
```bash
# For Windows users, open a cmd window
# By Typing `Win+R`, Input `cmd`, enter
# and run this command below
pip install django pymysql
```

#### Mac/Linux
```bash
# Run this command with your terminal
# For Mac/Linux users
sudo -H pip install django pymysql
```

TODO
-----
1. This is actually an empty project! Anything will help!
1. A Japanese version of this 'README.md' file is needed!

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
