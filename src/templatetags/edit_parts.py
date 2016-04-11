from django import template

register = template.Library()


@register.inclusion_tag('trojsten_forms/parts/edit.html', takes_context=True)
def show_edit_form(context):
    return context
