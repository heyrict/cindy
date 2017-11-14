from django import forms
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.forms import (PasswordChangeForm, PasswordResetForm,
                                       ReadOnlyPasswordHashField,
                                       UserChangeForm, UserCreationForm)
from django.contrib.auth.models import Group
from django.utils.translation import ugettext_lazy as _

from modeltranslation.admin import TranslationAdmin

from .models import *


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
            'profile',
            'current_award', )


class SuiheiPasswordChangeForm(PasswordChangeForm):
    class Meta(PasswordChangeForm):
        model = User


#class SuiheiPasswordResetForm(PasswordResetForm):


class SuiheiUserAdmin(UserAdmin):
    form = SuiheiUserChangeForm
    add_form = SuiheiUserCreationForm
    change_password_form = SuiheiPasswordChangeForm
    change_user_password_template = "registration/users_password_change.html"
    fieldsets = UserAdmin.fieldsets + ((None, {
        'fields': (
            'nickname',
            'current_award', )
    }), )


class SuiheiAwardAdmin(TranslationAdmin):
    pass


admin.site.register(User, SuiheiUserAdmin)
admin.site.register(Mondai)
admin.site.register(Shitumon)
admin.site.register(Lobby)
admin.site.register(Award, SuiheiAwardAdmin)
admin.site.register(UserAward)
admin.site.register(Star)
admin.site.register(Comment)
