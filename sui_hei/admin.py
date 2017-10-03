from django import forms
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.forms import (ReadOnlyPasswordHashField,
                                       UserChangeForm, UserCreationForm,
                                       PasswordChangeForm, PasswordResetForm)
from django.contrib.auth.models import Group
from django.utils.translation import ugettext_lazy as _

from .models import User

# Register your models here.
class SuiheiUserCreationForm(UserCreationForm):
    class Meta(UserCreationForm.Meta):
        model = User
        fields = UserCreationForm.Meta.fields + ('nickname', )


class SuiheiUserChangeForm(UserChangeForm):
    class Meta(UserChangeForm):
        model = User
        fields = UserCreationForm.Meta.fields + (
            'nickname',
            'profile', )

class SuiheiPasswordChangeForm(PasswordChangeForm):
    class Meta(PasswordChangeForm):
        model = User


class SuiheiUserAdmin(UserAdmin):
    form = SuiheiUserChangeForm
    add_form = SuiheiUserCreationForm
    change_password_form = SuiheiPasswordChangeForm
    change_user_password_template = "registration/users_password_change.html"
    fieldsets = UserAdmin.fieldsets + ((None,{'fields': ('nickname',)}),)


admin.site.register(User, SuiheiUserAdmin)
