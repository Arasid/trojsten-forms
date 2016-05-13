# -*- coding: utf-8 -*-
# Generated by Django 1.9.5 on 2016-05-13 14:04
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0007_alter_validators_add_error_messages'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Answer',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('ans', models.CharField(max_length=200)),
            ],
        ),
        migrations.CreateModel(
            name='Form',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=100)),
                ('description', models.CharField(blank=True, default='', max_length=300)),
                ('deadline', models.DateTimeField()),
                ('structure', models.CharField(default='[]', max_length=2000)),
                ('can_edit', models.ManyToManyField(blank=True, related_name='Edit', to='auth.Group')),
            ],
        ),
        migrations.CreateModel(
            name='Question',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('q_uuid', models.CharField(blank=True, max_length=100)),
                ('title', models.CharField(max_length=200)),
                ('description', models.CharField(blank=True, max_length=1000)),
                ('q_type', models.CharField(choices=[('S', 'Short answer'), ('L', 'Long answer'), ('S1T', 'Scale with text answer'), ('S2T', 'Two scales with text answer')], default='S', max_length=100)),
                ('options', models.CharField(default='{}', max_length=1000)),
                ('active', models.BooleanField(default=True)),
                ('form', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='trojsten_forms.Form')),
                ('orgs', models.ManyToManyField(blank=True, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddField(
            model_name='answer',
            name='question',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='trojsten_forms.Question'),
        ),
        migrations.AddField(
            model_name='answer',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterUniqueTogether(
            name='answer',
            unique_together=set([('user', 'question')]),
        ),
    ]