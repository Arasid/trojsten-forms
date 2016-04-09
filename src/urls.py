from django.conf.urls import url
from .views import QuestionViewSet

urlpatterns = [
    url(r'^trojsten_forms/',
        QuestionViewSet.as_view({'get': 'list', 'post': 'create'})),
    url(r'^trojsten_forms/',
        QuestionViewSet.as_view({'get': 'list', 'post': 'create'})),
    url(r'^questions/(?P<id>[0-9]+)/',
        QuestionViewSet.as_view({'get': 'retrieve'})),
]
