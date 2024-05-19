from django.db import models
from accounts.models import Users

# Create your models here.
class WalletHistory(models.Model):
    user = models.ForeignKey(Users, on_delete=models.CASCADE)
    deduction_or_addition = models.TextField(max_length=255, null=False)
    amount = models.FloatField(null=False, default=0)
    date = models.DateTimeField(null=False)



class Rating(models.Model):
    user = models.ForeignKey(Users, on_delete=models.CASCADE)
    rating = models.FloatField(null=False, default=0)

    class Meta:
        abstract = True  # This marks the class as abstract

class RequesterRating(Rating):
    pass
class ResponderRating(Rating):
    pass


class ServiceHistory(models.Model):
    responder = models.ForeignKey(Users, on_delete=models.PROTECT,related_name='service_histories_as_responder')
    requester = models.ForeignKey(Users, on_delete=models.PROTECT, related_name='service_histories_as_requester')
    requester_text = models.TextField(max_length=255, null=True)
    requester_rating = models.FloatField(null=True)#rating to requester
    responder_rating = models.FloatField(null=True)
    feedback_to_driver = models.TextField(max_length=255, null=True)
    feedback_to_requester = models.TextField(max_length=255, null=True)
    transaction_amount = models.FloatField(null=False, default=0)
    service_type = models.TextField(max_length=255, null=False)
    time_started = models.DateTimeField(null=False)#when the request was made
    time_accepted = models.DateTimeField(null=False)#when the request was accepted
    time_pickup = models.DateTimeField(null=False)#  when the request was picked up
    time_completed = models.DateTimeField(null=False)#when the request was completed
    driver_latitude = models.FloatField(null=False)
    driver_longitude = models.FloatField(null=False)
    pickup_latitude = models.FloatField(null=False)
    pickup_longitude = models.FloatField(null=False)
    pickup_place_name = models.TextField(max_length=255,null=False)
    end_latitude = models.FloatField(null=False)
    end_longitude = models.FloatField(null=False)
    end_place_name = models.TextField(max_length=255,null=False)
    distance = models.FloatField(null=False)
    duration=models.FloatField(null=False)

class CurrentRequest(models.Model):
    time_started = models.DateTimeField(null=False)
    requester = models.ForeignKey(Users, on_delete=models.CASCADE,related_name='current_requests_as_requester')
    transaction_amount = models.FloatField(null=False, default=0)
    service_type = models.TextField(max_length=255, null=False)
    requester_text = models.TextField(max_length=255, null=True)
    pickup_latitude = models.FloatField(null=False)
    pickup_longitude = models.FloatField(null=False)
    pickup_place_name = models.TextField(max_length=255,null=False)
    end_latitude = models.FloatField(null=False)
    end_longitude = models.FloatField(null=False)
    end_place_name = models.TextField(max_length=255,null=False)
    distance = models.FloatField(null=False)
    duration=models.FloatField(max_length=255, null=False)
    user_rating = models.FloatField(null=False, default=0)



    
class ActiveRides(models.Model):
    responder = models.ForeignKey(Users, on_delete=models.PROTECT,related_name='active_rides_as_responder')
    requester = models.ForeignKey(Users, on_delete=models.PROTECT,related_name='active_rides_as_requester')
    requester_text = models.TextField(max_length=255, null=False)
    requester_rating = models.FloatField(null=True,default= None)
    responder_rating = models.FloatField(null=True,default= None)
    feedback_to_driver = models.TextField(max_length=255, null=True,default=None)
    feedback_to_requester = models.TextField(max_length=255, null=True,default=None)
    transaction_amount = models.FloatField(null=False, default=0)
    service_type = models.TextField(max_length=255, null=False)
    time_started = models.DateTimeField(null=False)#when the request was made
    time_accepted = models.DateTimeField(null=False)#when the request was accepted
    time_pickup = models.DateTimeField(null=True)#  when the request was picked up
    time_completed = models.DateTimeField(null=True)#when the request was completed
    driver_latitude = models.FloatField(null=False)
    driver_longitude = models.FloatField(null=False)
    pickup_latitude = models.FloatField(null=False)
    pickup_longitude = models.FloatField(null=False)
    pickup_place_name = models.TextField(max_length=255,null=False)
    end_latitude = models.FloatField(null=False)
    end_longitude = models.FloatField(null=False)
    end_place_name = models.TextField(max_length=255,null=False)
    distance = models.FloatField(null=False)
    duration=models.FloatField(null=False)

# make a model for chat between requestere and responder. Foreign key to active rides and automatically delete when active ride is deleted
class Chat(models.Model):
    active_ride = models.ForeignKey(ActiveRides, on_delete=models.CASCADE)
    message = models.TextField(max_length=255, null=False)
    time = models.DateTimeField(null=False)
    is_requester = models.BooleanField(null=False)
