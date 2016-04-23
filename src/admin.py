from django.contrib import admin
from .models import Question, Form, Answer


# Register your models here.
class FormAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'deadline', 'description', 'structure',)


class QuestionAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'description', 'q_type', 'options', 'form', 'get_orgs')


class AnswerAdmin(admin.ModelAdmin):
    list_display = ('id', 'question', 'user', 'ans')

admin.site.register(Question, QuestionAdmin)
admin.site.register(Form, FormAdmin)
admin.site.register(Answer, AnswerAdmin)
