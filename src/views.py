from rest_framework import viewsets, mixins
from .models import Question, Form, Answer
from .serializers import QuestionSerializer, FormSerializer, AnswerSerializer


class FormViewSet(
    mixins.CreateModelMixin,
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    viewsets.GenericViewSet
):
    queryset = Form.objects.all()
    serializer_class = FormSerializer


class QuestionViewSet(
    mixins.CreateModelMixin,
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    viewsets.GenericViewSet
):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer


class AnswerViewSet(
    mixins.CreateModelMixin,
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    viewsets.GenericViewSet
):
    queryset = Answer.objects.all()
    serializer_class = AnswerSerializer
