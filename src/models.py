from __future__ import unicode_literals

from django.db import models
from django.contrib.auth.models import User


class Form(models.Model):
    structure = models.CharField(max_length=2000)


class Question(models.Model):
    title = models.CharField(max_length=200)
    description = models.CharField(max_length=1000)
    q_type = models.CharField(max_length=100)
    orgs = models.ManyToManyField(User)

    def get_orgs(self):
        return ", ".join([str(o) for o in self.orgs.all()])
    get_orgs.short_description = 'Orgs'


class Answer(models.Model):
    text = models.CharField(max_length=200)
    question = models.ForeignKey(Question)
    user = models.ForeignKey(User)
