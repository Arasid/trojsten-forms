from __future__ import unicode_literals

from django.db import models
from django.contrib.auth.models import User


class Form(models.Model):
    title = models.CharField(max_length=100)
    description = models.CharField(max_length=300, default="")
    deadline = models.DateTimeField()
    structure = models.CharField(max_length=2000, default="[]")

    def __str__(self):
        return self.title


class Question(models.Model):
    Q_TYPES = (
        ('S', 'Short answer'),
        ('L', 'Long answer'),
        ('MC', 'Multiple choice'),
        ('S1T', 'Scale with text answer'),
        ('S2T', 'Two scales with text answer'),
    )

    title = models.CharField(max_length=200)
    description = models.CharField(max_length=1000)
    form = models.ForeignKey(Form)
    q_type = models.CharField(max_length=100, choices=Q_TYPES, default='S')
    # options bude obsahovat required
    options = models.CharField(max_length=1000, default="{}")
    orgs = models.ManyToManyField(User)

    def get_orgs(self):
        return ", ".join([str(o) for o in self.orgs.all()])
    get_orgs.short_description = 'Orgs'

    def __str__(self):
        return self.title


class Answer(models.Model):
    text = models.CharField(max_length=200)
    question = models.OneToOneField(Question)
    user = models.ForeignKey(User)
