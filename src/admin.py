from django.contrib import admin
from .models import Question, Form, Answer


# Register your models here.
class FormAdmin(admin.ModelAdmin):
    list_display = ('title', 'deadline', 'structure',)


class QuestionAdmin(admin.ModelAdmin):
    list_display = ('title', 'description', 'q_type', 'form', 'get_orgs')


class AnswerAdmin(admin.ModelAdmin):
    list_display = ('question', 'user', 'text')

admin.site.register(Question, QuestionAdmin)
admin.site.register(Form, FormAdmin)
admin.site.register(Answer, AnswerAdmin)
