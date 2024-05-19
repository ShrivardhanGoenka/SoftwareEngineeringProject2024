from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.hashers import check_password, make_password
from . import models
import json
import uuid
from services.models import RequesterRating, ResponderRating, WalletHistory, ServiceHistory
from datetime import datetime


@csrf_exempt
def login(request):
    if request.method != "POST":
        return JsonResponse({'error': 'Invalid request'}, status=400)
    body = json.loads(request.body)
    if 'username' not in body or 'password' not in body:
        response = JsonResponse({'error': 'username and password are required'})
        response.status_code = 402
        return response

    username = body['username']
    password = body['password']

    try:
        user = models.Users.objects.get(username=username)
        if check_password(password, user.password):
            token = str(uuid.uuid4())
            models.AuthTokens.objects.create(token=token, user=user)
            response = JsonResponse({'token': token})
            response.status_code = 200
        else:
            response = JsonResponse({'error': 'Invalid credentials'})
            response.status_code = 401

    except models.Users.DoesNotExist:
        response = JsonResponse({'error': 'User does not exist'})
        response.status_code = 401
    return response

@csrf_exempt
def logout(request):
    if request.method != "DELETE":
        return JsonResponse({'error': 'Invalid request'}, status=400)
    token = request.headers.get('Authorization', None)
   
    if not token:
        response = JsonResponse({'error': 'missing field'})
        response.status_code = 402
        return response
    try:
        if token:
            models.AuthTokens.objects.filter(token=token).delete()
            print(token)
            
            response = JsonResponse({'message': 'You have been logged out'})
            response.status_code = 200
    except models.AuthTokens.DoesNotExist:
        response = JsonResponse({'error': 'Invalid credentials'})
        response.status_code = 401

    return response

@csrf_exempt
def signup(request):
    if request.method != "POST":
        return JsonResponse({'error': 'Invalid request'}, status=400)
    
    # check if the request is POST - keep raw
    # checking if all the required fields are present - keep raw
    # checking if the username and email already exists - checkUsername(username) checkEmail(email)
    # create a car if hasCar is true -  car = createCar(licence, carmodel, color)
    # creating a new user - createUser(username, password, email, name, phone, address, car)
    # creating a new token  - createToken(user)
    # returning the token - raw
    
    body = json.loads(request.body)
    if 'username' not in body or 'password' not in body or 'email' not in body or 'name' not in body or 'phone' not in body or 'address' not in body or 'hasCar' not in body:
        response = JsonResponse({'error': 'username, password, email, name, phone and address are required'})
        response.status_code = 402
        return response
    
    username = body['username']
    password = body['password']
    email = body['email']
    name = body['name']
    phone = body['phone']
    address = body['address']
    hasCar = body['hasCar']
    print(body)
        #check if username already exists
    if models.Users.objects.filter(username=username).exists():
        response = JsonResponse({'error': 'username already exists'})
        response.status_code = 401
        return response
    
    if models.Users.objects.filter(email=email).exists():
        response = JsonResponse({'error': 'email already exists'})
        response.status_code = 401
        return response

    #check if email already exists
    if models.Users.objects.filter(phone=phone).exists():
        response = JsonResponse({'error': 'phone already exists'})
        response.status_code = 401
        return response
    
    if hasCar == True:
        if 'licencePlate' not in body or 'model' not in body or 'color' not in body:
            response = JsonResponse({'error': 'licence, carmodel and color are required'})
            response.status_code = 402
            return response
        licence = body['licencePlate']
        carmodel = body['model']
        color = body['color']
        car = models.Car.objects.create(licence=licence, carmodel=carmodel, color=color)

    else:
        car = None

    try:
        user = models.Users(
            username=username,
            password=make_password(password),
            email=email,
            name=name,
            phone=phone,
            address=address,
            car=car
        )
        user.full_clean()  # Trigger validation
        user.save()  # Save the instance if validation passes
        RequesterRating.objects.create(user=user)
        ResponderRating.objects.create(user=user)
        token = str(uuid.uuid4())
        models.AuthTokens.objects.create(token=token, user=user)

        response = JsonResponse({'token': token})
        response.status_code = 200
        return response
    except:
        # Handle the validation error
        response = JsonResponse({'error': "Invalid email"})
        response.status_code = 401
        return response
    
    #user = models.Users.objects.create(username=username, password=make_password(password), email=email, name=name, phone=phone, address=address, car=car)

@csrf_exempt
def profile(request):
    if request.method != "GET" and request.method != "POST":
        return JsonResponse({'error': 'Invalid request'}, status=400)
    if request.method == "GET":
        print("Received get request")
        auth_token = request.headers.get('Authorization')
  

        try:
            user = models.AuthTokens.objects.get(token=auth_token).user  # this returns the user object
        except models.AuthTokens.DoesNotExist:
            return JsonResponse({'error': 'Invalid token'}, status=401)
        
        user_data = {
            'username': user.username,
            'email': user.email,
            'name': user.name,
            'phone': user.phone,
            'address': user.address,
            'wallet': user.wallet,
            'carModel': user.car.carmodel if user.car else None,
            'carLicense': user.car.licence if user.car else None,
            'carColor': user.car.color if user.car else None,
        }
        
        return JsonResponse(user_data,status=200)
    
    elif request.method == "POST":
        print("POST request received")
        print(request.user)
        data = json.loads(request.body)
        auth_token = request.headers.get('Authorization')
        print("data = ", data)
        print("request.headers = ", request.headers)
        
        
        try:
            user = models.AuthTokens.objects.get(token=auth_token).user  # this returns the user object
         
            
    
            if models.Users.objects.filter(email=data['email']).exclude(email=user.email).exists():
                response = JsonResponse({'error': 'email already exists'})
                response.status_code = 401
                return response

    #check if email already exists
            if models.Users.objects.filter(phone=data['phone']).exclude(phone=user.phone).exists():
                response = JsonResponse({'error': 'phone already exists'})
                response.status_code = 401
                return response
            
            def update(user):
                user.name = data['name']
                user.email = data['email']
                user.address = data['address']
                user.phone = data['phone']


                
                if user.car:
                     car=user.car
                     car.licence = data['licence']
                     car.model = data['carModel']
                     car.color = data['carColor']
                if user.car is None and data['hasCar'] == True:
                    if 'licence' not in data or 'carModel' not in data or 'carColor' not in data:
                        response = JsonResponse({'error': 'licence, carmodel and color are required'})
                        response.status_code = 402
                        return response

                    licence = data['licence']
                    carmodel = data['carModel']
                    color = data['carColor']
                    car = models.Car.objects.create(licence=licence, carmodel=carmodel, color=color)
                    user.car = car

                user.save()
                if user.car:
                    car.save()
            update(user)

            
        except Exception:
            return JsonResponse({'error': Exception}, status=401)
        
        
        return JsonResponse({"response": "good"},status=200)

@csrf_exempt
def walletaction(request):
    if request.method != "POST":
        return JsonResponse({'error': 'Invalid request'}, status=400)
    
    auth_token = request.headers.get('Authorization')

    try:
        user = models.AuthTokens.objects.get(token=auth_token).user  # this returns the user object
    except models.AuthTokens.DoesNotExist:
        return JsonResponse({'error': 'Invalid token'}, status=401)
    
    data = json.loads(request.body)
    if 'amount' not in data or 'action' not in data:
        response = JsonResponse({'error': 'missing field'})
        response.status_code = 402
        return response
    
    amount = data['amount']
    action = data['action']
    if action == 'topup':
        user.wallet += float(amount)
        user.save()
        WalletHistory.objects.create(user=user, deduction_or_addition='topup', amount=amount, date=datetime.now())
        return JsonResponse({'success': 'money added'}, status=200)
    elif action == 'withdraw':
        if user.wallet < float(amount):
            response = JsonResponse({'error': 'insufficient funds'})
            response.status_code = 403
            return response
        user.wallet -= float(amount)
        user.save()
        WalletHistory.objects.create(user=user, deduction_or_addition='withdraw', amount=amount, date=datetime.now())
        return JsonResponse({'success': 'money withdrawn'}, status=200)
    else:
        response = JsonResponse({'error': 'invalid action'})
        response.status_code = 401
        return response

@csrf_exempt
def wallethistory(request):
    if request.method != "GET":
        return JsonResponse({'error': 'Invalid request'}, status=400)
    
    auth_token = request.headers.get('Authorization')

    try:
        user = models.AuthTokens.objects.get(token=auth_token).user  # this returns the user object
    except models.AuthTokens.DoesNotExist:
        return JsonResponse({'error': 'Invalid token'}, status=401)
    history=WalletHistory.objects.filter(user=user).order_by('-date')
    if len(history)==0:
        return JsonResponse({'success': 'No history found'}, status=200)
    data=[]
    for i in history:
        data.append({'action':i.deduction_or_addition,'amount':i.amount,'date':i.date})
    return JsonResponse(data,status=200, safe=False)
@csrf_exempt
def wallet(request):
    if request.method != "GET":
        return JsonResponse({'error': 'Invalid request'}, status=400)
    
    auth_token = request.headers.get('Authorization')

    try:
        user = models.AuthTokens.objects.get(token=auth_token).user  # this returns the user object
    except models.AuthTokens.DoesNotExist:
        return JsonResponse({'error': 'Invalid token'}, status=401)
    
    wallet = user.wallet
    return JsonResponse({'wallet': wallet}, status=200)
@csrf_exempt
def servicehistory(request):
    if request.method != "GET":
        return JsonResponse({'error': 'Invalid request'}, status=400)
    
    auth_token = request.headers.get('Authorization')

    try:
        user = models.AuthTokens.objects.get(token=auth_token).user  # this returns the user object
    except models.AuthTokens.DoesNotExist:
        return JsonResponse({'error': 'Invalid token'}, status=401)
    body = json.loads(request.body)
    if 'type' not in body:
        response = JsonResponse({'error': 'missing field'})
        response.status_code = 402
        return response
    type = body['type']
    if type == 'requester':
        history=ServiceHistory.objects.filter(requester=user).order_by('-time_finalised')
        if len(history)==0:
            return JsonResponse({'error': 'No history found'}, status=403)
    elif type == 'responder':
        history=ServiceHistory.objects.filter(responder=user).order_by('-time_finalised')
        if len(history)==0:
            return JsonResponse({'error': 'No history found'}, status=403)
    else:
        response = JsonResponse({'error': 'invalid type'})
        response.status_code = 401
        return response
    data=[]
    for i in history:
        data.append({'requester':i.requester.username,'responder':i.responder.username,'requester_rating':i.requester_rating,'responder_rating':i.responder_rating,'feedback_to_driver':i.feedback_to_driver,'feedback_to_requester':i.feedback_to_requester,'transaction_amount':i.transaction_amount,'service_type':i.service_type,'time_started':i.time_started,'time_accepted':i.time_accepted,'time_pickup':i.time_pickup,'time_completed':i.time_completed,'time_finalised':i.time_finalised,'pickup_latitude':i.pickup_latitude,'pickup_longitude':i.pickup_longitude,'pickup_place_name':i.pickup_place_name,'end_latitude':i.end_latitude,'end_longitude':i.end_longitude,'end_place_name':i.end_place_name,'distance':i.distance,'duration':i.duration})
    return JsonResponse(data,status=200, safe=False)