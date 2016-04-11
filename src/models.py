from __future__ import unicode_literals

from django.db import models
from django.contrib.auth.models import User


class Form(models.Model):
    title = models.CharField(max_length=100)
    deadline = models.DateTimeField()
    structure = models.CharField(max_length=2000)

    def __str__(self):
        return self.title


class Question(models.Model):
    Q_TYPES = (
        ('S', 'Short answer'),
        ('L', 'Long answer'),
        ('S1L', 'Scale with long answer'),
        ('S2L', 'Two scales with long answer'),
        ('S2L2', 'Two scales with two long answers'),
    )

    title = models.CharField(max_length=200)
    form = models.ForeignKey(Form)
    description = models.CharField(max_length=1000)
    q_type = models.CharField(max_length=100, choices=Q_TYPES)
    orgs = models.ManyToManyField(User)

    def get_orgs(self):
        return ", ".join([str(o) for o in self.orgs.all()])
    get_orgs.short_description = 'Orgs'

    def __str__(self):
        return self.title


class Answer(models.Model):
    text = models.CharField(max_length=200)
    question = models.ForeignKey(Question)
    user = models.ForeignKey(User)
