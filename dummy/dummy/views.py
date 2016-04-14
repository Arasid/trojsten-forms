from django.shortcuts import render
from trojsten_forms import models
from django.utils import timezone
from .forms import UserForm
from django.contrib.auth import authenticate, login, logout
from django.http import HttpResponseRedirect, HttpResponse
from django.contrib.auth.decorators import login_required


def index(request):
    return render(request, 'dummy/index.html', {})


@login_required
def all_forms(request):
    all_entries = models.Form.objects.order_by('deadline')
    now = timezone.now()
    forms_active, forms_dead = [], []
    for ent in all_entries:
        if ent.deadline > now:
            forms_active.append({'title': ent.title, 'id': ent.id, 'deadline': ent.deadline})
        else:
            forms_dead.append({'title': ent.title, 'id': ent.id, 'deadline': ent.deadline})
    context_dict = {'forms_active': forms_active, 'forms_dead': forms_dead[::-1]}
    return render(request, 'dummy/all_forms.html', context_dict)


@login_required
def create_form(request):
    return render(request, 'dummy/edit_form.html', {'create': True, 'form_id': -1})


@login_required
def edit_form(request, form_id):
    return render(request, 'dummy/edit_form.html', {'form_id': form_id})


@login_required
def fill_form(request, form_id):
    return render(request, 'dummy/fill_form.html', {'form_id': form_id})


@login_required
def results_form(request, form_id):
    return render(request, 'dummy/results_form.html', {'form_id': form_id})


def register(request):
    registered = False
    if request.method == 'POST':
        user_form = UserForm(data=request.POST)
        if user_form.is_valid():
            user = user_form.save()
            user.set_password(user.password)
            user.save()
            registered = True
        else:
            print user_form.errors
    else:
        user_form = UserForm()

    return render(request, 'dummy/register.html', {'user_form': user_form, 'registered': registered})


def user_login(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(username=username, password=password)

        if user:
            if user.is_active:
                login(request, user)
                return HttpResponseRedirect('/')
            else:
                return HttpResponse("Your dummy account is disabled.")
        else:
            print "Invalid login details: {0}, {1}".format(username, password)
            return HttpResponse("Invalid login details supplied.")
    else:
        return render(request, 'dummy/login.html', {})


@login_required
def user_logout(request):
    logout(request)
    return HttpResponseRedirect('/')
