from django import forms
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.forms import (ReadOnlyPasswordHashField,
                                       UserChangeForm, UserCreationForm)
from django.contrib.auth.models import Group
from django.utils.translation import ugettext_lazy as _

from .models import User

# Register your models here.

# Referring to '/topics/auth/customizing.html#custom-users-and-the-built-in-auth-forms'
#class UserCreationForm(forms.ModelForm):
#    """A form for creating new users. Includes all the required
#    fields, plus a repeated password."""
#    password = forms.CharField(_('Password'), widget=forms.PasswordInput)
#    passwordc = forms.CharField(_('Password Confirm'), widget=forms.PasswordInput)
#
#    class Meta:
#        model = User
#        fields = ('username', 'nickname')
#
#    def clean_password(self):
#        password = self.clean_data.get("password")
#        passwordc = self.clean_data.get("passwordc")
#        if password and passwordc and password != passwordc:
#            raise forms.ValidationError(_("Passwords don't match"))
#        return password
#
#    def save(self, commit=True):
#        user = super(UserCreationForm, self).save(commit=False)
#        user.set_password(self.clean_data["password"])
#        if commit:
#            user.save()
#        return user
#
#class UserChangeForm(forms.ModelForm):
#    """A form for updating users. Includes all the fields on
#    the user, but replaces the password field with admin's
#    password hash display field.
#    """
#    class Meta:
#        model = User
#        fields = ('username', 'password', 'nickname', 'is_active', 'is_admin')


class CustomUserCreationForm(UserCreationForm):
    class Meta(UserCreationForm.Meta):
        model = User
        fields = UserCreationForm.Meta.fields + ('nickname', )


class CustomUserChangeForm(UserChangeForm):
    class Meta(UserChangeForm):
        model = User
        fields = UserCreationForm.Meta.fields + (
            'nickname',
            'profile', )


class CustomUserAdmin(UserAdmin):
    form = CustomUserChangeForm
    add_form = CustomUserCreationForm


admin.site.register(User, UserAdmin)
