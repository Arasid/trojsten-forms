from rest_framework import serializers
from .models import Question, Form, Answer
from django.contrib.auth.models import User


class FormSerializer(serializers.ModelSerializer):
    class Meta:
        model = Form
        fields = ('id', 'title', 'structure')


class QuestionSerializer(
    serializers.ModelSerializer
):
    class Meta:
        model = Question
        fields = ('id', 'title', 'form', 'q_type', 'orgs')


class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = ('id', 'text', 'user', 'question')


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
