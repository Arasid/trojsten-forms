from django.contrib import admin
from .models import Question, Form, Answer


# Register your models here.
class FormAdmin(admin.ModelAdmin):
    list_display = ('structure',)


class QuestionAdmin(admin.ModelAdmin):
    list_display = ('title', 'description', 'q_type', 'get_orgs')


class AnswerAdmin(admin.ModelAdmin):
    list_display = ('text', 'question', 'user')

admin.site.register(Question, QuestionAdmin)
admin.site.register(Form, FormAdmin)
admin.site.register(Answer, AnswerAdmin)
