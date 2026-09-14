from django.db import models

# Create your models here.

# Projeler kısmının modeli

class Projects(models.Model):
    title = models.CharField(max_length=150)
    short_description = models.CharField(max_length=250)
    description = models.TextField(max_length=500)
    github_url = models.URLField(max_length=200, blank=True)
    demo_url = models.URLField(max_length=200, blank=True)
    image = models.ImageField(upload_to='project_images/', blank=True, null=True)

    def __str__(self):
        return self.title

# Yetenekler kısmının modeli

class Skills(models.Model):
    name = models.CharField(max_length=100)
    icon = models.ImageField(upload_to='skill_icons/', blank=True, null=True)

    def __str__(self):
        return self.name

# Profil Modeli

class Profile(models.Model):
    bio = models.TextField(max_length=1000)
    cv = models.FileField(upload_to='cv_files/', blank=True, null=True)
    email = models.EmailField(max_length=254, blank=True, null=True)
    github_url = models.URLField(max_length=200, blank=True, null=True)
    linkedin_url = models.URLField(max_length=200, blank=True, null=True)

    def __str__(self):
        return "Profil Bilgileri"