from django.contrib import admin

from .models import Profile, Projects, Skills

# Register your models here.

# Modellerin admin paneline eklenmesi
admin.site.register(Projects)
admin.site.register(Skills)


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    def has_add_permission(self, request):
        return super().has_add_permission(request) and not Profile.objects.exists()
