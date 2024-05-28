# # type: ignore
# from django.db import models

# class User(models.Model):
#     userId = models.CharField(max_length=255, primary_key=True)
#     password = models.CharField(max_length=255)
#     isAdmin = models.BooleanField(default=False)

#     def __str__(self):
#         return self.userId


# class Resume(models.Model):
#     resumeId = models.CharField(max_length=255, primary_key=True)
#     userId = models.ForeignKey(User, related_name='resumes', on_delete=models.CASCADE)
#     name = models.CharField(max_length=255)
#     dateOfBirth = models.DateTimeField()
#     totalExperience = models.DecimalField(max_digits=10, decimal_places=2)
#     expectedSalary = models.DecimalField(max_digits=10, decimal_places=2)
#     city = models.CharField(max_length=255)
#     state = models.CharField(max_length=255)
#     country = models.CharField(max_length=255)
#     techKnowledge = models.JSONField()
#     domainKnowledge = models.JSONField()
#     keywords = models.CharField(max_length=255)
#     briefDescription = models.TextField(max_length=4000)
#     resumeFile = models.FileField(upload_to='resumes/')
#     pictureFile = models.ImageField(upload_to='pictures/')
#     isApproved = models.BooleanField(default=False)

#     def __str__(self):
#         return self.name

# class Country(models.Model):
#     name = models.CharField(max_length=255)

#     def __str__(self):
#         return self.name

# class State(models.Model):
#     name = models.CharField(max_length=255)
#     country = models.ForeignKey(Country, related_name='states', on_delete=models.CASCADE)

#     def __str__(self):
#         return self.name

# class City(models.Model):
#     name = models.CharField(max_length=255)
#     state = models.ForeignKey(State, related_name='cities', on_delete=models.CASCADE)

#     def __str__(self):
#         return self.name


# type: ignore
from django.db import models
from django.utils import timezone

class User(models.Model):
    id = models.AutoField(primary_key=True)  
    userId = models.CharField(max_length=255, unique=True) 
    password = models.CharField(max_length=255)
    isAdmin = models.BooleanField(default=False)
    isActive = models.BooleanField(default=True)
    created_at = models.DateTimeField(default=timezone.now)
    modified_at = models.DateTimeField(auto_now=True)
    modified_by = models.CharField(max_length=255, blank=True, null=True)  

    def __str__(self):
        return self.userId


class Resume(models.Model):
    resumeId = models.CharField(max_length=255, primary_key=True)
    userId = models.ForeignKey(User, related_name='resumes', on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    dateOfBirth = models.DateField()
    totalExperience = models.DecimalField(max_digits=10, decimal_places=2)
    expectedSalary = models.DecimalField(max_digits=10, decimal_places=2)
    city = models.CharField(max_length=255)
    state = models.CharField(max_length=255)
    country = models.CharField(max_length=255)
    techKnowledge = models.CharField(max_length=4000)
    domainKnowledge = models.CharField(max_length=4000)
    keywords = models.CharField(max_length=4000)
    briefDescription = models.TextField(max_length=4000)
    resumeFile = models.FileField(upload_to='resumes/')
    pictureFile = models.ImageField(upload_to='pictures/')
    isApproved = models.BooleanField(default=False)
    isActive = models.BooleanField(default=True)
    created_at = models.DateTimeField(default=timezone.now)
    modified_at = models.DateTimeField(auto_now=True)
    modified_by = models.CharField(max_length=255, blank=True, null=True)  

    def __str__(self):
        return self.name

class Country(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name

class State(models.Model):
    name = models.CharField(max_length=255)
    country = models.ForeignKey(Country, related_name='states', on_delete=models.CASCADE)

    def __str__(self):
        return self.name

class City(models.Model):
    name = models.CharField(max_length=255)
    state = models.ForeignKey(State, related_name='cities', on_delete=models.CASCADE)

    def __str__(self):
        return self.name


class AccessToken(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    access_token = models.CharField(max_length=255, primary_key=True)
    refresh_token = models.CharField(max_length=255)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Access token for {self.user.username}"
