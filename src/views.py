import json
from rest_framework import viewsets, mixins, views, status
from rest_framework.response import Response
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


class FormView(
    views.APIView
):
    permission_classes = (IsAuthenticated,)

    def post(self, request, format=None):
        questions = request.data['questions']
        form = request.data['form']

        questions_data = []
        form['structure'] = json.loads(form['structure'])
        for x in form['structure']:
            if x['type'] != 'question':
                continue
            q_serializer = QuestionSerializer(data=questions[x['q_uuid']])
            if q_serializer.is_valid():
                q_serializer.save()
                q_data = q_serializer.data
                questions_data.append(q_data)
            else:
                return Response(q_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        form['structure'] = json.dumps(form['structure'])

        formSerializer = FormSerializer(Form.objects.get(data=request.data['form']))
        if formSerializer.is_valid():
            formSerializer.save()
            response = {
                "form": formSerializer.data,
                "questions": questions_data
            }
            return Response(response)
        return Response(formSerializer.errors, status=status.HTTP_400_BAD_REQUEST)


class FormDetail(
    views.APIView
):
    permission_classes = (IsAuthenticated,)

    def get(self, request, form_id, format=None):
        form = Form.objects.get(pk=form_id)
        questions = Question.objects.filter(form=form_id, active=True)
        f_serializer = FormSerializer(form)
        q_serializer = QuestionSerializer(questions, many=True)
        response = {
            "form": f_serializer.data,
            "questions": q_serializer.data
        }
        return Response(response)

    def put(self, request, form_id, format=None):
        questions = request.data['questions']
        form = request.data['form']

        def process_question(q_uuid):
            q_data = questions[q_uuid]
            if not q_data['active']:
                return True, None

            q_serializer = None
            try:
                q = Question.objects.get(q_uuid=q_uuid)
                q_serializer = QuestionSerializer(q, data=q_data)
            except Question.DoesNotExist:
                q_serializer = QuestionSerializer(data=q_data)
                pass
            if q_serializer.is_valid():
                q_serializer.save()
                return True, q_serializer.data
            return False, q_serializer.errors

        questions_data = []
        form['structure'] = json.loads(form['structure'])
        structure = []
        for x in form['structure']:
            if x['type'] != 'question':
                structure.append(x)
                continue
            ok, q_data = process_question(x['q_uuid'])
            if q_data['active']:
                structure.append(x)
            if not ok:
                # nastal problem, dalej nerobim
                return Response(q_data, status=status.HTTP_400_BAD_REQUEST)
            elif q_data is not None:
                questions_data.append(q_data)
        form['structure'] = json.dumps(structure)

        formSerializer = FormSerializer(Form.objects.get(pk=form_id), data=request.data['form'])
        if formSerializer.is_valid():
            formSerializer.save()
            response = {
                "form": formSerializer.data,
                "questions": questions_data
            }
            return Response(response)
        return Response(formSerializer.errors, status=status.HTTP_400_BAD_REQUEST)


class QuestionList(
    ListBulkCreateUpdateDestroyAPIView
):
    serializer_class = QuestionSerializerBulk

    def get_queryset(self):
        form = self.kwargs['form']
        return Question.objects.filter(form=form)


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
