from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader


# Create your views here.
def game_view(request):
    template = loader.get_template('index.html')
    context = {
        'fruits': ['Apple', 'Banana', 'Cherry'],   
    }
    return HttpResponse(template.render(context, request))                     
