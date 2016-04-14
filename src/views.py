from rest_framework import viewsets, mixins, generics
from .models import Question, Form, Answer
from .serializers import QuestionSerializer, FormSerializer, AnswerSerializer


class FormViewSet(
    mixins.CreateModelMixin,
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    viewsets.GenericViewSet,
):
    queryset = Form.objects.all()
    serializer_class = FormSerializer


class QuestionViewSet(
    mixins.CreateModelMixin,
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    viewsets.GenericViewSet
):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer


class QuestionList(generics.ListAPIView):
    serializer_class = QuestionSerializer

    def get_queryset(self):
        form = self.kwargs['form']
        return Question.objects.filter(form=form)


class AnswerViewSet(
    mixins.CreateModelMixin,
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    viewsets.GenericViewSet
):
    queryset = Answer.objects.all()
    serializer_class = AnswerSerializer


class AnswerList(generics.ListAPIView):
    serializer_class = AnswerSerializer

    def get_queryset(self):
        user = self.request.user
        form = self.kwargs['form']
        return Answer.objects.filter(user=user, question__form=form)
