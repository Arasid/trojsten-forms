from rest_framework import serializers
from .models import Question, Form, Answer


class FormSerializer(serializers.ModelSerializer):
    class Meta:
        model = Form
        fields = ('id', 'title', 'deadline', 'structure', 'description')


class QuestionSerializer(
    serializers.ModelSerializer
):
    class Meta:
        model = Question
        fields = ('id', 'title', 'description', 'form', 'q_type', 'options', 'orgs')


class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = ('id', 'text', 'user', 'question')
