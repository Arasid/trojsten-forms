from django.conf.urls import url
from .views import QuestionViewSet, FormViewSet, AnswerViewSet

urlpatterns = [
    url(r'^trojsten_forms/', FormViewSet.as_view({'get': 'list', 'post': 'create'})),
    url(r'^trojsten_forms/forms/(?P<id>[0-9]+)/', FormViewSet.as_view({'get': 'retrieve'})),
    url(r'^trojsten_forms/questions/(?P<id>[0-9]+)/', QuestionViewSet.as_view({'get': 'retrieve'})),
    url(r'^trojsten_forms/answers/(?P<id>[0-9]+)/', AnswerViewSet.as_view({'get': 'retrieve'})),
]
