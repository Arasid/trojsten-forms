from rest_framework import viewsets, mixins
from .models import Question
from .serializers import QuestionSerializer


class QuestionViewSet(
    mixins.CreateModelMixin,
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    viewsets.GenericViewSet
):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
