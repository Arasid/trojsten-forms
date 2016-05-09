from rest_framework import permissions
from rest_framework.exceptions import NotFound
from django.utils import timezone
from .models import Form
from .serializers import FormSerializer


class IsRightGroup(permissions.BasePermission):

    def has_permission(self, request, view):
        form_id = view.kwargs['form_id']
        form = Form.objects.get(pk=form_id)
        f_serializer = FormSerializer(form)

        active_user = request.user
        can_edit = f_serializer.data['can_edit']
        groups = [g.id for g in active_user.groups.all()]
        inter = set(can_edit) & set(groups)
        if len(inter) == 0:
            raise NotFound()
        return True


class NotAfterDeadline(permissions.BasePermission):

    def has_permission(self, request, view):
        form_id = view.kwargs['form_id']
        form = Form.objects.get(pk=form_id)

        if timezone.now() > form.deadline:
            raise NotFound()
        return True


class IsStaff(permissions.BasePermission):

    def has_permission(self, request, view):
        return request.user.is_staff
