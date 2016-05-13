from django.conf.urls import url, include
from rest_framework import routers
from .views import FormViewSet, QuestionViewSet, AnswerViewSet, UserViewSet, GroupViewSet, FormView, FormDetail, ResultsDetail, FillForm, StaffUserViewSet

router = routers.DefaultRouter()
router.register(r'user', UserViewSet)
router.register(r'staff_user', StaffUserViewSet)
router.register(r'group', GroupViewSet)
router.register(r'form', FormViewSet)
router.register(r'question', QuestionViewSet)
router.register(r'answer', AnswerViewSet)

urlpatterns = [
    url(r'^', include(router.urls)),
    url('^whole_form/$', FormView.as_view()),
    url('^whole_form/(?P<form_id>\d+)/$', FormDetail.as_view()),
    url('^fill_form/(?P<form_id>\d+)/$', FillForm.as_view()),
    url('^results/(?P<form_id>\d+)/$', ResultsDetail.as_view()),
]
