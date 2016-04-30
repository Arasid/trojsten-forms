from rest_framework import viewsets, mixins
from rest_framework.permissions import IsAuthenticated
from rest_framework_bulk import ListBulkCreateUpdateDestroyAPIView
from .models import Question, Form, Answer
from django.contrib.auth.models import User, Group
from .serializers import QuestionSerializer, FormSerializer, AnswerSerializer, QuestionSerializerBulk, AnswerSerializerBulk, UserSerializer, GroupSerializer


class UserViewSet(
    mixins.CreateModelMixin,
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet,
):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (IsAuthenticated,)


class GroupViewSet(
    mixins.CreateModelMixin,
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet,
):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = (IsAuthenticated,)


class FormViewSet(
    mixins.CreateModelMixin,
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet,
):
    queryset = Form.objects.all()
    serializer_class = FormSerializer
    permission_classes = (IsAuthenticated,)


class QuestionViewSet(
    mixins.CreateModelMixin,
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet
):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    permission_classes = (IsAuthenticated,)


class QuestionList(
    ListBulkCreateUpdateDestroyAPIView
):
    serializer_class = QuestionSerializerBulk

    def get_queryset(self):
        form = self.kwargs['form']
        return Question.objects.filter(form=form)


class AnswerViewSet(
    mixins.CreateModelMixin,
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet
):
    queryset = Answer.objects.all()
    serializer_class = AnswerSerializer
    permission_classes = (IsAuthenticated,)

    def pre_save(self, obj):
        obj.user = self.request.user

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class UserAnswerList(
    ListBulkCreateUpdateDestroyAPIView
):
    serializer_class = AnswerSerializerBulk

    def get_queryset(self):
        user = self.request.user
        form = self.kwargs['form']
        return Answer.objects.filter(user=user, question__form=form)


class AnswerList(
    ListBulkCreateUpdateDestroyAPIView
):
    serializer_class = AnswerSerializerBulk

    def get_queryset(self):
        form = self.kwargs['form']
        return Answer.objects.filter(question__form=form)
