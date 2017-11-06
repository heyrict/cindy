# coding: utf-8

from rest_framework import serializers

from .models import Mondai

class MondaiSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mondai
        fields = ('user_id', 'title', 'score')
