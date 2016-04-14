from django import template

register = template.Library()


@register.inclusion_tag('trojsten_forms/parts/results.html', takes_context=True)
def show_results_form(context):
    return context
