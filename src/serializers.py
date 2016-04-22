from rest_framework import serializers
from .models import Question, Form, Answer
from rest_framework_bulk import BulkListSerializer, BulkSerializerMixin


class FormSerializer(serializers.ModelSerializer):
    class Meta:
        model = Form
        fields = ('id', 'title', 'deadline', 'structure', 'description')


class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ('id', 'title', 'description', 'form', 'q_type', 'options', 'orgs')


class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = ('id', 'text', 'user', 'question')


class QuestionSerializerBulk(BulkSerializerMixin, serializers.ModelSerializer):
    class Meta(object):
        model = Question
        # only necessary in DRF3
        list_serializer_class = BulkListSerializer
