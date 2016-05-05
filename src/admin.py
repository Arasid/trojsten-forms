from django.contrib import admin
from django.utils.encoding import force_text
from django.contrib.auth.admin import UserAdmin as DefaultUserAdmin
from .models import Question, Form, Answer, User


class UserAdmin(DefaultUserAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff', 'get_groups')

    def get_groups(self, obj):
        return ', '.join(force_text(x) for x in obj.groups.all())
    get_groups.short_description = "Groups"


# Register your models here.
class FormAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'deadline', 'description', 'structure', 'get_can_edit')


class QuestionAdmin(admin.ModelAdmin):
    list_display = ('id', 'q_uuid', 'title', 'active', 'description', 'q_type', 'options', 'form', 'get_orgs')


class AnswerAdmin(admin.ModelAdmin):
    list_display = ('id', 'question', 'user', 'ans')

admin.site.unregister(User)
admin.site.register(User, UserAdmin)
admin.site.register(Question, QuestionAdmin)
admin.site.register(Form, FormAdmin)
admin.site.register(Answer, AnswerAdmin)
