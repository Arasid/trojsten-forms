"""dummy URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.9/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url, include
from django.contrib import admin
from . import views

urlpatterns = [
    url(r'^$', views.index, name="index"),
    url(r'^forms/$', views.forms, name="index"),
    url(r'^admin/', admin.site.urls),
    url(r'^forms/create/$', views.create_form, name='create_form'),
    url(r'^forms/edit/(?P<form_id>\d+)/$', views.edit_form, name='edit_form'),
    url(r'^forms/fill/(?P<form_id>\d+)/$', views.fill_form, name='fill_form'),
    url(r'^forms/results/(?P<form_id>\d+)/$', views.results_form, name='results_form'),
    url(r'^api/', include("dummy.trojsten_forms.urls")),
    url(r'^register/$', views.register, name='register'),
    url(r'^login/$', views.user_login, name='login'),
    url(r'^logout/$', views.user_logout, name='logout'),
]
