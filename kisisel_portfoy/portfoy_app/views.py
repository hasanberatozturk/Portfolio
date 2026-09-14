from django.shortcuts import render

from .models import Profile, Projects, Skills

# Create your views here.
def index(request):
   projects = Projects.objects.all().order_by('-pk')  # Projeleri id'ye göre azalan sırayla al

   return render(request, 'portfoy_app/index.html', {'projects': projects,'skills': Skills.objects.all(), 'profile': Profile.objects.first()})
