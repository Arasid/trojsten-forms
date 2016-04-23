from django.conf.urls import url, include
from rest_framework import routers
from .views import FormViewSet, QuestionViewSet, AnswerViewSet, QuestionList, UserAnswerList, AnswerList,UserViewSet

router = routers.DefaultRouter()
router.register(r'user', UserViewSet)
router.register(r'form', FormViewSet)
router.register(r'question', QuestionViewSet)
router.register(r'answer', AnswerViewSet)

urlpatterns = [
    url(r'^', include(router.urls)),
    url('^questions/(?P<form>\d+)/$', QuestionList.as_view()),
    url('^answers/(?P<form>\d+)/$', AnswerList.as_view()),
    url('^user_answers/(?P<form>\d+)/$', UserAnswerList.as_view()),
]
