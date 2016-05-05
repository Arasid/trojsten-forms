import json
from rest_framework import viewsets, mixins, views, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Question, Form, Answer
from django.contrib.auth.models import User, Group
from .serializers import QuestionSerializer, FormSerializer, AnswerSerializer, UserSerializer, GroupSerializer
from .permissions import IsRightGroup, IsStaff


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
    permission_classes = (IsAuthenticated, IsStaff, )

    def post(self, request, format=None):
        questions = request.data['questions']
        form = request.data['form']

        structure = []
        for x in form['structure']:
            if x['type'] != 'question':
                structure.append(x)
                continue
            if not questions[x['q_uuid']]['active']:
                continue
            structure.append(x)
        form['structure'] = json.dumps(structure)

        formSerializer = FormSerializer(data=form)
        if formSerializer.is_valid():
            formSerializer.save()
            form = formSerializer.data
            form['structure'] = json.loads(form['structure'])

            questions_data = {}
            for x in form['structure']:
                if x['type'] != 'question':
                    continue
                q_data = questions[x['q_uuid']]
                q_data['form'] = form['id']
                q_data['options'] = json.dumps(q_data['options'])
                q_serializer = QuestionSerializer(data=q_data)
                if q_serializer.is_valid():
                    q_serializer.save()
                    q_data = q_serializer.data
                    q_data['options'] = json.loads(q_data['options'])
                    questions_data[q_data['q_uuid']] = q_data
                else:
                    return Response(q_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            response = {
                'form': form,
                'questions': questions_data
            }
            return Response(response)
        return Response(formSerializer.errors, status=status.HTTP_400_BAD_REQUEST)


class FormDetail(
    views.APIView
):
    permission_classes = (IsAuthenticated, IsRightGroup, IsStaff, )

    def get(self, request, form_id, format=None):
        form = Form.objects.get(pk=form_id)
        questions = Question.objects.filter(form=form_id, active=True)
        f_serializer = FormSerializer(form)
        q_serializer = QuestionSerializer(questions, many=True)

        questions_data = {}
        for q in q_serializer.data:
            q['options'] = json.loads(q['options'])
            questions_data[q['q_uuid']] = q

        form = f_serializer.data
        form['structure'] = json.loads(form['structure'])

        response = {
            "form": form,
            "questions": questions_data
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
                q_data['options'] = json.dumps(q_data['options'])
                q = Question.objects.get(q_uuid=q_uuid)
                q_serializer = QuestionSerializer(q, data=q_data)
            except Question.DoesNotExist:
                q_serializer = QuestionSerializer(data=q_data)
                pass
            if q_serializer.is_valid():
                q_serializer.save()
                return True, q_serializer.data
            return False, q_serializer.errors

        questions_data = {}
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
                q_data['options'] = json.loads(q_data['options'])
                questions_data[q_data['q_uuid']] = q_data

        form['structure'] = json.dumps(structure)
        formSerializer = FormSerializer(Form.objects.get(pk=form_id), data=request.data['form'])
        if formSerializer.is_valid():
            formSerializer.save()
            form = formSerializer.data
            form['structure'] = json.loads(form['structure'])
            response = {
                'form': form,
                'questions': questions_data
            }
            return Response(response)
        return Response(formSerializer.errors, status=status.HTTP_400_BAD_REQUEST)


class FillForm(
    views.APIView
):
    permission_classes = (IsAuthenticated, )

    def get(self, request, form_id, format=None):
        user = request.user
        form = Form.objects.get(pk=form_id)
        questions = Question.objects.filter(form=form_id, active=True)
        answers = Answer.objects.filter(user=user, question__form=form_id)
        f_serializer = FormSerializer(form)
        q_serializer = QuestionSerializer(questions, many=True)
        a_serializer = AnswerSerializer(answers, many=True)

        questions_data = {}
        for q in q_serializer.data:
            q['options'] = json.loads(q['options'])
            questions_data[q['q_uuid']] = q

        form = f_serializer.data
        form['structure'] = json.loads(form['structure'])

        answers_data = {}
        for a in a_serializer.data:
            a['ans'] = json.loads(a['ans'])
            answers_data[a['question']] = a

        response = {
            "form": form,
            "questions": questions_data,
            "answers": answers_data
        }
        return Response(response)

    def put(self, request, form_id, format=None):
        user = request.user
        answers = request.data

        def process_answer(a_data, q_id):
            a_serializer = None
            a_data['question'] = q_id
            try:
                a_data['ans'] = json.dumps(a_data['ans'])
                a = Answer.objects.get(question=q_id, user=user)
                a_serializer = AnswerSerializer(a, data=a_data)
            except Answer.DoesNotExist:
                a_serializer = AnswerSerializer(data=a_data)
            if a_serializer.is_valid():
                a_serializer.save()
                return True, a_serializer.data
            return False, a_serializer.errors

        answers_data = {}
        for q_id, answer in answers.items():
            ok, a_data = process_answer(answer, q_id)
            if not ok:
                # nastal problem, dalej nerobim
                return Response(a_data, status=status.HTTP_400_BAD_REQUEST)
            else:
                a_data['ans'] = json.loads(a_data['ans'])
                answers_data[a_data['question']] = a_data

        response = answers_data
        return Response(response)


class ResultsDetail(
    views.APIView
):
    permission_classes = (IsAuthenticated, IsRightGroup, IsStaff, )

    def get(self, request, form_id, format=None):
        form = Form.objects.get(pk=form_id)
        f_serializer = FormSerializer(form)

        questions = Question.objects.filter(form=form_id, active=True)
        answers = Answer.objects.filter(question__form=form_id)
        q_serializer = QuestionSerializer(questions, many=True)
        a_serializer = AnswerSerializer(answers, many=True)
        structure = json.loads(f_serializer.data['structure'])
        users = set()

        question_list = []
        questions_data = {}
        answers_data = {}

        for x in q_serializer.data:
            x['options'] = json.loads(x['options'])
            questions_data[x['q_uuid']] = x

        for x in structure:
            if x['type'] != 'question':
                continue
            question_list.append(x['q_uuid'])
            users |= set(questions_data[x['q_uuid']]['orgs'])

        for answer in a_serializer.data:
            if answer['user'] not in answers_data:
                answers_data[answer['user']] = {}
            answers_data[answer['user']][answer['question']] = json.loads(answer['ans'])

        orgs = User.objects.filter(pk__in=list(users))
        o_serializer = UserSerializer(orgs, many=True)

        a_users = User.objects.filter(pk__in=answers_data.keys())
        u_serializer = UserSerializer(a_users, many=True)
        answers_users = {}
        for user in u_serializer.data:
            answers_users[user['id']] = user

        response = {
            "answer_users": answers_users,
            "orgs": o_serializer.data,
            "question_list": question_list,
            "questions_data": questions_data,
            "answers_data": answers_data,
            "title": f_serializer.data['title']
        }
        return Response(response)
