from __future__ import unicode_literals

from django.db import models
from django.contrib.auth.models import User
from django.contrib.auth.models import Group


class Form(models.Model):
    title = models.CharField(max_length=100)
    description = models.CharField(max_length=300, default="", blank=True)
    deadline = models.DateTimeField()
    structure = models.CharField(max_length=2000, default="[]")
    can_edit = models.ManyToManyField(Group, blank=True, related_name="Edit")

    def get_can_edit(self):
        return ", ".join([str(o) for o in self.can_edit.all()])
    get_can_edit.short_description = 'Users for edit'

    def __str__(self):
        return self.title + "__" + str(self.deadline)

    def __unicode__(self):
        return u'{t}'.format(t=self.title)


class Question(models.Model):
    Q_TYPES = (
        ('S', 'Short answer'),
        ('L', 'Long answer'),
        ('MC', 'Multiple choice'),
        ('S1T', 'Scale with text answer'),
        ('S2T', 'Two scales with text answer'),
    )

    title = models.CharField(max_length=200)
    description = models.CharField(max_length=1000, blank=True)
    form = models.ForeignKey(Form)
    q_type = models.CharField(max_length=100, choices=Q_TYPES, default='S')
    # options bude obsahovat required
    options = models.CharField(max_length=1000, default="{}")
    orgs = models.ManyToManyField(User, blank=True)
    active = models.BooleanField(default=True)

    def get_orgs(self):
        return ", ".join([str(o) for o in self.orgs.all()])
    get_orgs.short_description = 'Orgs'

    def __str__(self):
        return self.title

    def __unicode__(self):
        return u'{t}'.format(t=self.title)


class Answer(models.Model):
    ans = models.CharField(max_length=200)
    question = models.ForeignKey(Question)
    user = models.ForeignKey(User)

    class Meta:
        unique_together = ("user", "question")
