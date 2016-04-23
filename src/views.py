from rest_framework import viewsets, mixins, generics
from rest_framework.permissions import IsAuthenticated
from rest_framework_bulk import ListBulkCreateUpdateDestroyAPIView
from .models import Question, Form, Answer
from .serializers import QuestionSerializer, FormSerializer, AnswerSerializer, QuestionSerializerBulk, AnswerSerializerBulk


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
