from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from . import models
import json
from datetime import datetime, timedelta
from django.utils import timezone
from SWEBackend.commonErrorCatcher import validate_request_method, validate_auth_token, missing_fields
from services.requestSorter import process_pending_requests
from services.ratingHandler import ratingmanager


@csrf_exempt
def request(request):
#For users to request a ride
#Parse in the information of the ride
#Check if the user has an active ride or current request else error
#Check if the user has sufficient funds else error
#Create a new current request for the user
    try:
        validate_request_method(request, ['POST'])
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)
    try:
        user =  validate_auth_token(request)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=401)

    try:
        
        if models.CurrentRequest.objects.filter(requester=user):
            return JsonResponse({'error': 'User already has a current request'}, status=403)

    except models.CurrentRequest.DoesNotExist:
        pass
    #check stage of active ride
    try:
        if models.ActiveRides.objects.get(requester=user):
            return JsonResponse({'error': 'User has active ride'}, status=403)
    except models.ActiveRides.DoesNotExist:
        pass


    body = json.loads(request.body)
    try:
        missing_fields(['service_type','requester_text','pickup_latitude','pickup_longitude','pickup_place_name','end_latitude','end_longitude','end_place_name','distance','duration','transaction_amount'], body)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=402)

    

    service_type = body['service_type']
    requester_text = body['requester_text']
    time_started =datetime.now()
    pickup_latitude = body['pickup_latitude']
    pickup_longitude = body['pickup_longitude']
    pickup_place_name = body['pickup_place_name']
    end_latitude = body['end_latitude']
    end_longitude = body['end_longitude']
    end_place_name = body['end_place_name']
    distance = float(body['distance']) / 1000
    duration = round(float(body['duration']) / 60, 2)
    transaction_amount=body['transaction_amount']
    if float(transaction_amount) > float(user.wallet):
        return JsonResponse({'error': 'Insufficient funds'}, status=403)
    user_rating = models.RequesterRating.objects.get(user=user).rating


    current_request = models.CurrentRequest.objects.create(user_rating=user_rating,time_started=time_started, requester=user, transaction_amount=transaction_amount, service_type=service_type, requester_text=requester_text,pickup_latitude=pickup_latitude, pickup_longitude=pickup_longitude, pickup_place_name=pickup_place_name, end_latitude=end_latitude, end_longitude=end_longitude, end_place_name=end_place_name, distance=distance, duration=duration)

    return JsonResponse({"response": "good"},status=200)

@csrf_exempt
def requesterupdates(request):
#For requester to keep pinging to check the status of their request/ride
#Check the stage of the active ride
#If the user has a current request, return 'Awaiting driver'
#If the user has an active ride and the driver has not picked up the user, return 'Awaiting pickup'
#If the user has an active ride and the driver has picked up the user, return 'On Route'
#If the user has an active ride and the driver has completed the ride, return 'none'
#After the requester is dropoffed, delete the active ride and return the ServiceHistoryID to let the requester rate the driver
    try:
        validate_request_method(request, ['GET'])
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)
    
    try:
        user =  validate_auth_token(request)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=401)
    #check stage of active ride

    try:
        if models.CurrentRequest.objects.filter(requester=user):
            return JsonResponse({'status': 'Awaiting driver'}, status=200)
    except models.CurrentRequest.DoesNotExist:
        pass

    try:
        if models.ActiveRides.objects.get(requester=user):
            current_ride = models.ActiveRides.objects.get(requester=user)
            if current_ride.time_pickup is None:
                return JsonResponse({'status': 'Awaiting pickup',
                                     'driver_latitude':current_ride.driver_latitude,
                                     'driver_longitude':current_ride.driver_longitude}, status=200)
            if current_ride.time_completed is None:
                return JsonResponse({'status': 'On Route',
                                     'driver_latitude':current_ride.driver_latitude,
                                     'driver_longitude':current_ride.driver_longitude}, status=200)
            if current_ride.time_completed is not None:
                current_ride.delete()
                ridehistory=models.ServiceHistory.objects.filter(requester=user).order_by('-time_completed').first()
                return JsonResponse({"status":"none", "ServiceHistoryID":ridehistory.id}, status=200)
    except models.ActiveRides.DoesNotExist:
        pass
    
    return JsonResponse({'status': 'none'}, status=200)

@csrf_exempt
def drive(request):
#For drivers to filter the pending requests and get the top 3 shortest routes base on current location
#Parse in the location of the driver
#Check if the user has an active ride or current request else error
#Check if the user has a car else error

    try:
        validate_request_method(request, ['POST'])
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)
    
    try:
        user =  validate_auth_token(request)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=401)
    if models.ActiveRides.objects.filter(responder=user) or models.CurrentRequest.objects.filter(requester=user):
        return JsonResponse({'error': 'User already has an active ride or current request'}, status=403)
    if user.car is None:
        return JsonResponse({'error': 'User has no car'}, status=403)
    body = json.loads(request.body)
    try:
        missing_fields(['location_latitude','location_longitude'], body)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=402)

    location_latitude = body['location_latitude']
    location_longitude = body['location_longitude']
    results=process_pending_requests(location_latitude,location_longitude)
    print(results)
    response = JsonResponse(results, safe=False)
    response.status_code = 200
    return response

@csrf_exempt
def cancel(request):
#For requester to cancel their current request
#Check if the user has an active ride or current request else error
#Delete the current request

    try:
        validate_request_method(request, ['DELETE'])
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)
    
    try:
        user =  validate_auth_token(request)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=401)
    try:
        current_requests = models.CurrentRequest.objects.filter(requester=user).delete()
    except models.CurrentRequest.DoesNotExist:
        return JsonResponse({'error': 'No current requests'}, status=403)
    
    return JsonResponse({"response": "good"},status=200)

@csrf_exempt
def accept(request):
#For drivers to accept a request
#Parse in the current_request_id, and initial driver_latitude and driver_longitude
#Check if the user has an active ride or current request else error
#Check if the current_request_id is valid else error
#Check if the driver is not the requester else error
#Create a new active ride for the user and delete the current request

    try:
        validate_request_method(request, ['POST'])
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)
    
    try:
        user =  validate_auth_token(request)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=401)
    body = json.loads(request.body)
    try:
        missing_fields(['current_request_id','driver_latitude','driver_longitude'], body)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=402)
    
    current_request_id = body['current_request_id']
    if models.ActiveRides.objects.filter(requester=user) or models.ActiveRides.objects.filter(responder=user) or models.CurrentRequest.objects.filter(requester=user):
        return JsonResponse({'error': 'User already has an active ride or current request'}, status=403)
    try:
        current_request = models.CurrentRequest.objects.get(id=current_request_id)
    except models.CurrentRequest.DoesNotExist:
        return JsonResponse({'error': 'Invalid current_request_id'}, status=401)
    if user == current_request.requester:
        return JsonResponse({'error': 'Cannot accept own request'}, status=403)
    driver_latitude = body['driver_latitude']
    driver_longitude = body['driver_longitude']
    requester_name = current_request.requester.name
    requester = current_request.requester
    time_started = current_request.time_started
    transaction_amount = current_request.transaction_amount
    service_type = current_request.service_type
    requester_text = current_request.requester_text
    pickup_latitude = current_request.pickup_latitude
    pickup_longitude = current_request.pickup_longitude
    pickup_place_name = current_request.pickup_place_name
    end_latitude = current_request.end_latitude
    end_longitude = current_request.end_longitude
    end_place_name = current_request.end_place_name
    distance = current_request.distance
    duration=current_request.duration

    active_ride = models.ActiveRides.objects.create(driver_latitude=driver_latitude,driver_longitude=driver_longitude ,responder=user, requester=requester, requester_text=requester_text, transaction_amount=transaction_amount, service_type=service_type,  time_started=time_started,time_accepted=datetime.now(), pickup_latitude=pickup_latitude, pickup_longitude=pickup_longitude, pickup_place_name=pickup_place_name, end_latitude=end_latitude, end_longitude=end_longitude, end_place_name=end_place_name, distance=distance, duration=duration)

    current_request.delete()
    return JsonResponse({"user's name": requester_name},status=200)

@csrf_exempt
def pickup(request):
#For drivers to upodate status to picked up
#Check if the user has an active ride or current request else error
#Check if the ride has not been picked up yet else error
#Update the time_pickup of the active ride 

    try:
        validate_request_method(request, ['POST'])
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)
    
    try:
        user =  validate_auth_token(request)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=401)
    
    try:
        current_ride = models.ActiveRides.objects.get(responder=user)
        if current_ride.time_pickup is None:
            current_ride.time_pickup = datetime.now()
            current_ride.save()
        else:
            return JsonResponse({'error': 'Already picked up'}, status=403)

    except models.ActiveRides.DoesNotExist:
        return JsonResponse({'error': 'No current requests'}, status=403)



    return JsonResponse({"response": "good"},status=200)

@csrf_exempt
def dropoff(request):
#For drivers to update status to dropped off
#Check if the user has an active ride or current request else error
#Check if the ride has been picked up yet else error
#Update the time_completed of the active ride
#Calculate the actual duration of the ride
#Update the wallets of the requester and responder
#Create a new wallet history for the requester and responder
#Create a new service history for the ride
#Return the ServiceHistoryID for driver to rate the requester
    try:
        validate_request_method(request, ['POST'])
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)
    
    try:
        user =  validate_auth_token(request)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=401)
    
    try:
        current_ride = models.ActiveRides.objects.get(responder=user)
        if current_ride.time_pickup is None:
            return JsonResponse({'error': 'Not picked up yet'}, status=403)
        elif current_ride.time_completed is None:
            current_ride.time_completed = datetime.now()
            current_ride.save()
            try:
                requester = current_ride.requester  # Assuming 'requester' field exists in ActiveRides model
                requester.wallet -= current_ride.transaction_amount
                user.wallet += current_ride.transaction_amount
                requester.save()  # Save changes to requester's wallet
                user.save()
            except:
                return JsonResponse({'error': 'Error updating wallets'}, status=500)
        else:
            return JsonResponse({'error': 'Already dropped off'}, status=403)

    except models.ActiveRides.DoesNotExist:
        return JsonResponse({'error': 'No current requests'}, status=403)

    wallet = models.WalletHistory.objects.create(user=user, deduction_or_addition='addition', amount=current_ride.transaction_amount, date=datetime.now())
    wallet.save()
    wallet = models.WalletHistory.objects.create(user=requester, deduction_or_addition='deduction', amount=current_ride.transaction_amount, date=datetime.now())
    wallet.save()
    pickuptime=current_ride.time_pickup.replace(tzinfo=None) +timedelta(hours=8)
    duration=current_ride.time_completed - pickuptime
    print (current_ride.time_completed)
    print (pickuptime)
    print(duration)
    duration_minutes = duration.total_seconds() / 60
    print(duration.total_seconds())
    print(duration_minutes)
    formatted_duration = "{:.2f}".format(duration_minutes)
    print(formatted_duration)
    current_ride.duration=float(formatted_duration)
    print(current_ride.duration)
    current_ride.save()
    saved=models.ServiceHistory.objects.create(driver_longitude=current_ride.driver_longitude,driver_latitude=current_ride.driver_latitude,responder=current_ride.responder, requester=current_ride.requester, requester_text=current_ride.requester_text, transaction_amount=current_ride.transaction_amount, service_type=current_ride.service_type, time_started=current_ride.time_started, time_accepted=current_ride.time_accepted, time_pickup=current_ride.time_pickup, time_completed=current_ride.time_completed, pickup_latitude=current_ride.pickup_latitude, pickup_longitude=current_ride.pickup_longitude, pickup_place_name=current_ride.pickup_place_name, end_latitude=current_ride.end_latitude, end_longitude=current_ride.end_longitude, end_place_name=current_ride.end_place_name, distance=current_ride.distance, duration=current_ride.duration)
    
    return JsonResponse({"ServiceHistoryID":saved.id},status=200)

@csrf_exempt
def rating(request):
#For users to rate each other
#Parse in the rating, rating_text and ride_id
#Check if the user is the requester or responder of the ride
#Check if the user has not rated the other user yet
    try:
        validate_request_method(request, ['POST'])
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)
    
    try:
        user =  validate_auth_token(request)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=401)
    
    body = json.loads(request.body)
    try:
        missing_fields(['rating','rating_text','ride_id'], body)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=402)
    
    rating = body['rating']
    rating_text = body['rating_text']
    ride_id = body['ride_id']
    try:
        ride=models.ServiceHistory.objects.get(id=ride_id)
    except:
        return JsonResponse({'error': 'Invalid ride_id'}, status=401)
    
    if ride.requester==user:
        role='requester'
    elif ride.responder==user:
        role='responder'
    else:
        return JsonResponse({'error': 'Invalid user for this ride'}, status=401)
    


    if role=='requester' and ride.responder_rating is None:
        ride.responder_rating=rating
        ride.feedback_to_driver=rating_text
        ride.save()
        ratingmanager('responder',ride.responder_rating,ride.responder)
        return JsonResponse({'success': 'Rating recorded'}, status=200)
    elif role=='responder' and ride.requester_rating is None:
        ride.requester_rating=rating
        ride.feedback_to_requester=rating_text
        ride.save()
        ratingmanager('requester',ride.requester_rating,ride.requester)
        return JsonResponse({'success': 'Rating recorded'}, status=200)
    else:
        return JsonResponse({'error': 'Rating already recorded'}, status=403)

@csrf_exempt
def current_ride_info(request):
#For GET request, constantly call this api to get the information of the rideS
#Check if the user is the requester or responder of the ride
#Return the information of the ride
#If the user is the requester, return the car details of the responder
#If the user is the responder, return the requester details
#For POST request, constantly call this api to update the location of the driver for requester


    try:
        validate_request_method(request, ['GET','POST'])
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)
    
    try:
        user =  validate_auth_token(request)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=401)
    
    if request.method == "POST":
        body = json.loads(request.body)
        try:
            missing_fields(['driver_latitude','driver_longitude'], body)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=402)
        
        
        try:
            current_ride = models.ActiveRides.objects.get(responder=user)
        except:
            return JsonResponse({'error': 'No current rides'}, status=403)
    
        current_ride.driver_latitude = body['driver_latitude']
        current_ride.driver_longitude = body['driver_longitude']
        current_ride.save()
        return JsonResponse({'success': 'Location updated'}, status=200)

    if request.method == "GET":
        try:
            current_ride = models.ActiveRides.objects.get(requester=user)
        except:
            try:
                current_ride = models.ActiveRides.objects.get(responder=user)
            except:
                return JsonResponse({'error': 'No current rides'}, status=403)
            
        responser = current_ride.responder
            
        #Find the car details 
        car = responser.car
        car_details = {
            'licence': car.licence,
            'carmodel': car.carmodel,
            'color': car.color
        }

        data = {
            'requester_text': current_ride.requester_text,
            'transaction_amount': current_ride.transaction_amount,
            'service_type': current_ride.service_type,
            'driver_latitude': current_ride.driver_latitude,
            'driver_longitude': current_ride.driver_longitude,
            'pickup_latitude': current_ride.pickup_latitude,
            'pickup_longitude': current_ride.pickup_longitude,
            'pickup_place_name': current_ride.pickup_place_name,
            'end_latitude': current_ride.end_latitude,
            'end_longitude': current_ride.end_longitude,
            'end_place_name': current_ride.end_place_name,
            'distance': current_ride.distance,
            'duration': current_ride.duration,
            'responder_name': current_ride.responder.name,
            'requster_name': current_ride.requester.name,
            'ride_id': current_ride.id, 
            'car_details': car_details,
            'time_started': current_ride.time_started,
        }
        
        return JsonResponse(data,status=200)


@csrf_exempt
def anyrides(request):
#For frontend to check if the user has any current rides or requests
    try:
        validate_request_method(request, ['GET'])
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)
    
    try:
        user =  validate_auth_token(request)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=401)

    try:
        if models.CurrentRequest.objects.filter(requester=user):
            print('request')
            return JsonResponse({'status': 'request'}, status=200)
        elif models.ActiveRides.objects.filter(requester=user):
            print('active_requester')
            return JsonResponse({'status': 'active_requester'}, status=200)
        elif models.ActiveRides.objects.filter(responder=user):
            print('active_responder')
            return JsonResponse({'status': 'active_responder'}, status=200)
        else:
            print('none')
            return JsonResponse({'status': 'none'}, status=200)
    except:
        print('error')
        return JsonResponse({'status': 'none'}, status=200)

@csrf_exempt
def getCurrentRequestDetails(request):
#For frontend to get the details of the current request
#Check if the user has a current request else error
    try:
        validate_request_method(request, ['GET'])
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)
    
    try:
        user =  validate_auth_token(request)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=401)
    
    print(user)
    
    try:
        current_request = models.CurrentRequest.objects.get(requester=user)
    except:
        return JsonResponse({'error': 'No current requests'}, status=403)
    
    data = {
        'requester_text': current_request.requester_text,
        'transaction_amount': current_request.transaction_amount,
        'service_type': current_request.service_type,
        'pickup_latitude': current_request.pickup_latitude,
        'pickup_longitude': current_request.pickup_longitude,
        'pickup_place_name': current_request.pickup_place_name,
        'end_latitude': current_request.end_latitude,
        'end_longitude': current_request.end_longitude,
        'end_place_name': current_request.end_place_name,
        'distance': current_request.distance,
        'duration': current_request.duration
    }
    
    return JsonResponse(data,status=200)

@csrf_exempt
def getResponderStatus(request):
#For frontend to check the status of the responder
#Check if the user has an active ride else error
#Return the status and location of the driver

    try:
        validate_request_method(request, ['GET'])
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)
    
    try:
        user =  validate_auth_token(request)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=401)

    try:
        if models.ActiveRides.objects.filter(responder=user):
            
            current_ride = models.ActiveRides.objects.get(responder=user)
            if current_ride.time_pickup is None:
                return JsonResponse({'status': 'Awaiting pickup',
                                     'driver_latitude':current_ride.driver_latitude,
                                     'driver_longitude':current_ride.driver_longitude}, status=200)
            if current_ride.time_completed is None:
                return JsonResponse({'status': 'On Route',
                                     'driver_latitude':current_ride.driver_latitude,
                                     'driver_longitude':current_ride.driver_longitude}, status=200)
            if current_ride.time_completed is not None:
                current_ride.delete()
                return JsonResponse({'status': 'none'}, status=200)

        else:
            return JsonResponse({'status': 'none'}, status=200)
    except:
        return JsonResponse({'status': 'none'}, status=200)
    
@csrf_exempt
def getServiceIdByTimeStarted(request):
#For frontend to get the service history id by the time started
#Check if the user has a service history with the time started else error
#Return the service history id
    try:
        validate_request_method(request, ['POST'])
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)

    try:
        user =  validate_auth_token(request)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=401)

    body = json.loads(request.body)

    

    try:
        missing_fields(['time_started'], body)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=402)

    time_started = body['time_started']

    # iterate through the service history table where the requester is the user
    
    try:
        service_history = models.ServiceHistory.objects.filter(requester=user)
    except:
        return JsonResponse({'error': 'No service history'}, status=403)
    
    for service in service_history:
        s = str(service.time_started)
        s = s[:-9]
        s += 'Z'
        s = s.replace(' ', 'T')

        if s == time_started:
            return JsonResponse({'ServiceHistoryID': service.id}, status=200)
        
    return JsonResponse({'error': 'No service history with that time started'}, status=403)


@csrf_exempt
def chat(request):
#For users to chat with each other
#Check if the user has an active ride else error
#For POST request, parse in the message, time and role
#Create a new chat for the user
#For GET request, return the chat history of the user

    try:
        validate_request_method(request, ['GET','POST'])
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)
    
    try:
        user =  validate_auth_token(request)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=401)
    
    try:
        current_ride = models.ActiveRides.objects.get(requester=user)
    except:
        try:
            current_ride = models.ActiveRides.objects.get(responder=user)
        except:
            return JsonResponse({'error': 'No current rides'}, status=403)
    
    if request.method == "POST":
        body = json.loads(request.body)
        try:
            missing_fields(['message','time','role'], body)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=402)
        
        message = body['message']
        time = body['time']
        role = body['role']

        if role == 'requester':
            models.Chat.objects.create(active_ride=current_ride, message=message, time=time, is_requester=True)
        elif role == 'responder':
            models.Chat.objects.create(active_ride=current_ride, message=message, time=time, is_requester=False)

        return JsonResponse({'success': 'Message sent'}, status=200)
    
    if request.method == "GET":
        chats = models.Chat.objects.filter(active_ride=current_ride)
        chat_history = []
        for chat in chats:
            chat_history.append({'message': chat.message, 'time': chat.time, 'role': 'requester' if chat.is_requester else 'responder'})
        
        return JsonResponse({"chat": chat_history}, status=200)


@csrf_exempt
def get_rating(request):
#For frontend to get the rating of the user

    try:
        validate_request_method(request, ['GET'])
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)
    
    try:
        user =  validate_auth_token(request)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=401)

    try:
        ratingAsRequester = models.RequesterRating.objects.get(user=user).rating
        ratingAsResponder = models.ResponderRating.objects.get(user=user).rating
    except:
        return JsonResponse({'error': 'Database error'}, status=500)
    
    data = {
        'ratingAsRequester': ratingAsRequester,
        'ratingAsResponder': ratingAsResponder
    }

    return JsonResponse(data,status=200)