from rest_framework import serializers
from .models import Question, Form, Answer
from rest_framework_bulk import BulkListSerializer, BulkSerializerMixin
from django.contrib.auth.models import User, Group


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name')


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ('id', 'name')


class FormSerializer(serializers.ModelSerializer):
    class Meta:
        model = Form
        fields = ('id', 'title', 'deadline', 'structure', 'description', 'can_edit')


class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ('id', 'q_uuid', 'title', 'active', 'description', 'form', 'q_type', 'options', 'orgs')


class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = ('id', 'user', 'ans', 'question')


class QuestionSerializerBulk(BulkSerializerMixin, serializers.ModelSerializer):
    class Meta(object):
        model = Question
        # only necessary in DRF3
        list_serializer_class = BulkListSerializer


class AnswerSerializerBulk(BulkSerializerMixin, serializers.ModelSerializer):
    class Meta(object):
        model = Answer
        # only necessary in DRF3
        list_serializer_class = BulkListSerializer
