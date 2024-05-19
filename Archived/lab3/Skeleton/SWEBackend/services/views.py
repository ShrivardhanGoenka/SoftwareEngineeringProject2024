from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from . import models
import json
from datetime import datetime 
import requests
from django.db import connection
from accounts.models import AuthTokens

def compute_routes( start_lat, start_lng, end_lat, end_lng):
    url = 'https://routes.googleapis.com/directions/v2:computeRoutes'

    headers = {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': 'AIzaSyDceEuIFOg5MZeWQPC8tT8kt5mrozgPv4I',
        'X-Goog-FieldMask': 'routes.duration,routes.distanceMeters'
    }

    data = {
        "origin": {
            "location": {
                "latLng": {
                    "latitude": start_lat,
                    "longitude": start_lng
                }
            }
        },
        "destination": {
            "location": {
                "latLng": {
                    "latitude": end_lat,
                    "longitude": end_lng
                }
            }
        },
        "travelMode": "DRIVE",
        "routingPreference": "TRAFFIC_AWARE",
        "computeAlternativeRoutes": False,
        "routeModifiers": {
            "avoidTolls": False,
            "avoidHighways": False,
            "avoidFerries": False
        },
        "languageCode": "en-US",
        "units": "METRIC"
    }

    response = requests.post(url, headers=headers, json=data)

    if response.status_code == 200:
        return response.json()
    else:
        return f'Error: {response.status_code} - {response.text}'
    
def fetch_pending_requests():
    with connection.cursor() as cursor:
        cursor.execute("SELECT * FROM services_currentrequest")
        rows = cursor.fetchall()
    return rows

def process_pending_requests(location_latitude,location_longitude):

    pending_requests = fetch_pending_requests()
    results = {}
    for row in pending_requests:
        
        pending_request_id = row[0]
        start_lat = location_latitude
        start_lng = location_longitude
        end_lat = row[5]
        end_lng = row[6]
        route_result = compute_routes(start_lat, start_lng, end_lat, end_lng)

        if route_result and route_result.get('routes'):  # Check for valid routes data
            route = route_result['routes'][0]
            distance_km = route.get('distanceMeters', 0) / 1000

            # Extract and convert duration (assuming seconds format)
            duration_seconds = int(route['duration'].strip('s'))  # Remove "s" and convert to int
            duration_minutes = round(duration_seconds / 60, 2)  # Convert seconds to minutes
            current_request = models.CurrentRequest.objects.get(id=pending_request_id)

            transaction_amount = current_request.transaction_amount
            service_type = current_request.service_type
    

            requester_text = current_request.requester_text
            pickup_latitude = current_request.pickup_latitude
            pickup_longitude = current_request.pickup_longitude
            pickup_place_name = current_request.pickup_place_name
            end_latitude = current_request.end_latitude
            end_longitude = current_request.end_longitude
            end_place_name = current_request.end_place_name
            ridedistance = current_request.distance
            rideduration=current_request.duration
            
            # Create the result dictionary with filtered data
            results[pending_request_id] = {
                "distanceKm": distance_km,
                "durationMinutes": duration_minutes,
                "transactionAmount": transaction_amount,
                "serviceType": service_type,
                "requesterText": requester_text,
                "pickupLatitude": pickup_latitude,
                "pickupLongitude": pickup_longitude,
                "pickupPlaceName": pickup_place_name,
                "endLatitude": end_latitude,
                "endLongitude": end_longitude,
                "endPlaceName": end_place_name,
                "rideDistance": ridedistance,
                "rideDuration": rideduration
            }



    return results

def ratingmanager(user_rated_role,rating,user_rated):
    if user_rated_role=='requester':
        try:
            rides=models.ServiceHistory.objects.filter(requester=user_rated)
            count=0
            count = len(rides)
        except:
            count=1
        total=models.RequesterRating.objects.get(user=user_rated).rating*(count-1)
        total+=float(rating)
        total=total/(count)
        rating=models.RequesterRating.objects.get(user=user_rated)
        rating.rating=total
        rating.save()
        return

    if user_rated_role=='responder':
        try:
            rides=models.ServiceHistory.objects.filter(responder=user_rated)
            count=0
            count = len(rides)
        except:
            count=1
        total=models.ResponderRating.objects.get(user=user_rated).rating*(count-1)
        total+=float(rating)
        total=total/(count)
        rating=models.ResponderRating.objects.get(user=user_rated)
        rating.rating=total
        rating.save()
        return

@csrf_exempt
def request(request):
    if request.method != "POST":
        return JsonResponse({'error': 'Invalid request'}, status=400)
    
    auth_token = request.headers.get('Authorization')

    try:
        user= AuthTokens.objects.get(token=auth_token).user  # this returns the user object

    except models.AuthTokens.DoesNotExist:
            return JsonResponse({'error': 'Invalid token'}, status=401)

    try:
        
        if models.CurrentRequest.objects.filter(requester=user):
            return JsonResponse({'error': 'User already has a current request'}, status=403)

    except models.CurrentRequest.DoesNotExist:
        pass
    #check stage of active ride
    try:
        if models.ActiveRides.objects.get(requester=user):
            current_ride = models.ActiveRides.objects.get(responder=user)
            return JsonResponse({'error': 'User has active ride'}, status=403)
    except models.ActiveRides.DoesNotExist:
        pass


    body = json.loads(request.body)

    if 'service_type' not in body  or 'requester_text' not in body or 'pickup_latitude' not in body or 'pickup_longitude' not in body or 'pickup_place_name' not in body or 'end_latitude' not in body or 'end_longitude' not in body or 'end_place_name' not in body or 'distance' not in body or 'duration' not in body or 'transaction_amount' not in body:
        response = JsonResponse({'error': 'missing field'})
        response.status_code = 402
        return response
    

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




    #simple rate counter maybe do in frontend and send back here as a dollar amount?
    """ if duration *1 > distance *1:
         transcation_amount = duration *1
    else:
        transcation_amount = distance *1 """
    #transcation_amount = 100

    current_request = models.CurrentRequest.objects.create(time_started=time_started, requester=user, transaction_amount=transaction_amount, service_type=service_type, requester_text=requester_text,pickup_latitude=pickup_latitude, pickup_longitude=pickup_longitude, pickup_place_name=pickup_place_name, end_latitude=end_latitude, end_longitude=end_longitude, end_place_name=end_place_name, distance=distance, duration=duration)

    return JsonResponse({"response": "good"},status=200)

@csrf_exempt
def requesterupdates(request):
    if request.method != "GET":
        return JsonResponse({'error': 'Invalid request'}, status=400)
    
    auth_token = request.headers.get('Authorization')

    try:
        user= AuthTokens.objects.get(token=auth_token).user  # this returns the user object

    except models.AuthTokens.DoesNotExist:
            return JsonResponse({'error': 'Invalid token'}, status=401)
    #check stage of active ride

    try:
        if models.CurrentRequest.objects.filter(requester=user):
            return JsonResponse({'success': 'Awaiting driver'}, status=200)
    except models.CurrentRequest.DoesNotExist:
        pass

    try:
        if models.ActiveRides.objects.get(requester=user):
            current_ride = models.ActiveRides.objects.get(requester=user)
            if current_ride.time_pickup is None:
                return JsonResponse({'Accepted': 'Awaiting pickup'}, status=200)
            if current_ride.time_completed is None:
                return JsonResponse({'Accepted': 'On Route'}, status=200)
            if current_ride.time_completed is not None:
                current_ride.delete()
                ridehistory=models.ServiceHistory.objects.filter(requester=user).order_by('-time_completed').first()
                return JsonResponse({"ServiceHistoryID":ridehistory.id}, status=200)
    except models.ActiveRides.DoesNotExist:
        pass
    
    return JsonResponse({'error': 'No request found for user'}, status=403)

@csrf_exempt
def drive(request):
    if request.method != "POST":
        return JsonResponse({'error': 'Invalid request'}, status=400)
    
    auth_token = request.headers.get('Authorization')

    try:
        user = AuthTokens.objects.get(token=auth_token).user   # this returns the user object
    except models.AuthTokens.DoesNotExist:
            return JsonResponse({'error': 'Invalid token'}, status=401)   
    if models.ActiveRides.objects.filter(responder=user) or models.CurrentRequest.objects.filter(requester=user):
        return JsonResponse({'error': 'User already has an active ride or current request'}, status=403)
    if user.car is None:
        return JsonResponse({'error': 'User has no car'}, status=403)
    body = json.loads(request.body)
    if 'location_latitude' not in body or 'location_longitude' not in body:
                response = JsonResponse({'error': 'location field missing'})
                response.status_code = 402
                return response
    location_latitude = body['location_latitude']
    location_longitude = body['location_longitude']
    results=process_pending_requests(location_latitude,location_longitude)
    print(results)
    shortest_routes = sorted(results.items(), key=lambda x: int(x[1].get('durationMinutes', 0)))
    shortest_routes=shortest_routes[:3]
    print(shortest_routes)
    response = JsonResponse(shortest_routes, safe=False)
    response.status_code = 200
    return response

@csrf_exempt
def cancel(request):
    if request.method != "DELETE":
        return JsonResponse({'error': 'Invalid request'}, status=400)
    
    auth_token = request.headers.get('Authorization')

    try:
        user = AuthTokens.objects.get(token=auth_token).user   # this returns the user object
    except models.AuthTokens.DoesNotExist:
            return JsonResponse({'error': 'Invalid token'}, status=401)   
    try:
        current_requests = models.CurrentRequest.objects.filter(requester=user).delete()
    except models.CurrentRequest.DoesNotExist:
        return JsonResponse({'error': 'No current requests'}, status=403)
    return JsonResponse({"response": "good"},status=200)

@csrf_exempt
def accept(request):
    if request.method != "POST":
        return JsonResponse({'error': 'Invalid request'}, status=400)
    
    auth_token = request.headers.get('Authorization')

    try:
        user = AuthTokens.objects.get(token=auth_token).user   # this returns the user object
    except models.AuthTokens.DoesNotExist:
            return JsonResponse({'error': 'Invalid token'}, status=401)
    body = json.loads(request.body)

    if 'current_request_id' not in body:
        response = JsonResponse({'error': 'missing field'})
        response.status_code = 402
        return response
    
    current_request_id = body['current_request_id']
    if models.ActiveRides.objects.filter(requester=user) or models.ActiveRides.objects.filter(responder=user) or models.CurrentRequest.objects.filter(requester=user):
        return JsonResponse({'error': 'User already has an active ride or current request'}, status=403)
    try:
        current_request = models.CurrentRequest.objects.get(id=current_request_id)
    except models.CurrentRequest.DoesNotExist:
        return JsonResponse({'error': 'Invalid current_request_id'}, status=401)
    if user == current_request.requester:
        return JsonResponse({'error': 'Cannot accept own request'}, status=403)
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

    active_ride = models.ActiveRides.objects.create(responder=user, requester=requester, requester_text=requester_text, transaction_amount=transaction_amount, service_type=service_type,  time_started=time_started,time_accepted=datetime.now(), pickup_latitude=pickup_latitude, pickup_longitude=pickup_longitude, pickup_place_name=pickup_place_name, end_latitude=end_latitude, end_longitude=end_longitude, end_place_name=end_place_name, distance=distance, duration=duration)

    current_request.delete()
    return JsonResponse({"user's name": requester_name},status=200)

@csrf_exempt
def pickup(request):
    if request.method != "POST":
        return JsonResponse({'error': 'Invalid request'}, status=400)
    
    auth_token = request.headers.get('Authorization')

    try:
        user = AuthTokens.objects.get(token=auth_token).user   # this returns the user object
    except models.AuthTokens.DoesNotExist:
            return JsonResponse({'error': 'Invalid token'}, status=401)   
    
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
    if request.method != "POST":
        return JsonResponse({'error': 'Invalid request'}, status=400)
    
    auth_token = request.headers.get('Authorization')
    
    try:
        user = AuthTokens.objects.get(token=auth_token).user   # this returns the user object
    except models.AuthTokens.DoesNotExist:
            return JsonResponse({'error': 'Invalid token'}, status=401)   
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
    
    saved=models.ServiceHistory.objects.create(responder=current_ride.responder, requester=current_ride.requester, requester_text=current_ride.requester_text, transaction_amount=current_ride.transaction_amount, service_type=current_ride.service_type, time_started=current_ride.time_started, time_accepted=current_ride.time_accepted, time_pickup=current_ride.time_pickup, time_completed=current_ride.time_completed, pickup_latitude=current_ride.pickup_latitude, pickup_longitude=current_ride.pickup_longitude, pickup_place_name=current_ride.pickup_place_name, end_latitude=current_ride.end_latitude, end_longitude=current_ride.end_longitude, end_place_name=current_ride.end_place_name, distance=current_ride.distance, duration=current_ride.duration)
    
    return JsonResponse({"ServiceHistoryID":saved.id},status=200)

@csrf_exempt
def rating(request):
    if request.method != "POST":
        return JsonResponse({'error': 'Invalid request'}, status=400)
    
    auth_token = request.headers.get('Authorization')
    
    try:
        user = AuthTokens.objects.get(token=auth_token).user   # this returns the user object
    except models.AuthTokens.DoesNotExist:
            return JsonResponse({'error': 'Invalid token'}, status=401)
    
    body = json.loads(request.body)
    if 'rating' not in body or 'rating_text' not in body or 'ride_id' not in body:
        response = JsonResponse({'error': 'missing field'})
        response.status_code = 402
        return response
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
    if request.method != "GET":
        return JsonResponse({'error': 'Invalid request'}, status=400)
    
    auth_token = request.headers.get('Authorization')
    
    try:
        user = AuthTokens.objects.get(token=auth_token).user   # this returns the user object
    except models.AuthTokens.DoesNotExist:
            return JsonResponse({'error': 'Invalid token'}, status=401)   

    try:
        current_ride = models.ActiveRides.objects.get(requester=user)
    except:
        try:
            current_ride = models.ActiveRides.objects.get(responder=user)
        except:
            return JsonResponse({'error': 'No current rides'}, status=403)
    
    data = {
        'requester_text': current_ride.requester_text,
        'transaction_amount': current_ride.transaction_amount,
        'service_type': current_ride.service_type,
        'pickup_latitude': current_ride.pickup_latitude,
        'pickup_longitude': current_ride.pickup_longitude,
        'pickup_place_name': current_ride.pickup_place_name,
        'end_latitude': current_ride.end_latitude,
        'end_longitude': current_ride.end_longitude,
        'end_place_name': current_ride.end_place_name,
        'distance': current_ride.distance,
        'duration': current_ride.duration,
        'responder_name': current_ride.responder.name,
        'requster_name': current_ride.requester.name
    }
        
    return JsonResponse(data,status=200)


@csrf_exempt
def anyrides(request):
    if request.method != "GET":
        return JsonResponse({'error': 'Invalid request'}, status=400)
    
    auth_token = request.headers.get('Authorization')
    
    try:
        user = AuthTokens.objects.get(token=auth_token).user   # this returns the user object
    except models.AuthTokens.DoesNotExist:
            return JsonResponse({'error': 'Invalid token'}, status=401)   
    
    try:
        if models.CurrentRequest.objects.get(requester=user):
            return JsonResponse({'success': 'User has current request'}, status=200)
        elif models.ActiveRides.objects.get(requester=user):
            return JsonResponse({'success': 'User has active ride as requester'}, status=200)
        elif models.ActiveRides.objects.get(responder=user):
            return JsonResponse({'success': 'User has active ride as responder'}, status=200)
        else:
            return JsonResponse({'error': 'No rides found'}, status=403)
    except:
        return JsonResponse({'error': 'No rides found'}, status=403)
  

        