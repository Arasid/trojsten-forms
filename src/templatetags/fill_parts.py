from django import template

register = template.Library()


@register.inclusion_tag('trojsten_forms/parts/fill.html', takes_context=True)
def show_fill_form(context):
    return context
