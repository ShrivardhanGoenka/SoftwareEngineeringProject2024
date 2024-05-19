from django.db import models


# Create your models here.
class Car(models.Model):
    licence = models.TextField(max_length=255, null=False)
    carmodel = models.TextField(max_length=255, null=False)
    color = models.TextField(max_length=255, null=False)

class Users(models.Model):
    username = models.TextField(max_length=255, null=False)
    password = models.TextField(max_length=255, null=False)
    email = models.EmailField(max_length=255, null=False)
    name = models.TextField(max_length=255, null=False)
    phone = models.TextField(max_length=255, null=False)
    address = models.TextField(max_length=255, null=False)
    car = models.ForeignKey(Car, on_delete=models.SET_NULL, null=True, blank=True)
    wallet = models.FloatField(null=False, default=0)

class AuthTokens(models.Model):
    token = models.TextField(max_length=255, null=False)
    user = models.ForeignKey(Users, on_delete=models.CASCADE)



