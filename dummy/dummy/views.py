from django.shortcuts import render
from trojsten_forms import models
from django.utils import timezone


def index(request):
    all_entries = models.Form.objects.order_by('deadline')
    now = timezone.now()
    forms_active, forms_dead = [], []
    for ent in all_entries:
        if ent.deadline > now:
            forms_active.append({'title': ent.title, 'id': ent.id, 'deadline': ent.deadline})
        else:
            forms_dead.append({'title': ent.title, 'id': ent.id, 'deadline': ent.deadline})
    context_dict = {'forms_active': forms_active, 'forms_dead': forms_dead[::-1]}
    return render(request, 'dummy/index.html', context_dict)


def form(request, form_id):
    return render(request, 'dummy/form.html', {'form_id': form_id})
