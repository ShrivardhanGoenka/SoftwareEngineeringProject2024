from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.hashers import check_password, make_password
from . import models
import json
import uuid
from services.models import RequesterRating, ResponderRating, WalletHistory, ServiceHistory, CurrentRequest, ActiveRides
from datetime import datetime
from SWEBackend.commonErrorCatcher import validate_request_method, validate_auth_token, missing_fields


@csrf_exempt
def login(request):
#For users to login, they must provide their username and password
#Generate a authtoken for the user if the username and password are correct
    try:
        validate_request_method(request, ['POST'])
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)
    
    body = json.loads(request.body)

    try:
        missing_fields(['username', 'password'], body)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=402)

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
#For users to logout, they must provide their authtoken
#Delete the authtoken from the database

    try:
        validate_request_method(request, ['DELETE'])
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)
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
#For users to signup, they must provide their username, password, email, name, phone, address, hasCar(true/false)
#If hasCar is true, they must provide their car details
#Create a new user in the database
#Generate an authtoken for the user
    try:
        validate_request_method(request, ['POST'])
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)
    
    # check if the request is POST - keep raw
    # checking if all the required fields are present - keep raw
    # checking if the username and email already exists - checkUsername(username) checkEmail(email)
    # create a car if hasCar is true -  car = createCar(licence, carmodel, color)
    # creating a new user - createUser(username, password, email, name, phone, address, car)
    # creating a new token  - createToken(user)
    # returning the token - raw
    
    body = json.loads(request.body)
    try:
        missing_fields(['username', 'password', 'email', 'name', 'phone', 'address', 'hasCar'], body)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=402)


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
#For GET requests, return the user's profile details
#For POST requests, update the user's profile details
#If the user has a car, update the car details
#If the user does not have a car, create a new car object, if hascar is true

    try:
        validate_request_method(request, ['GET','POST'])
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)
    
    try:
        user =  validate_auth_token(request)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=401)
    
    if request.method == "GET":
        print("Received get request")

        
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
        print("data = ", data)
         
        
        try:
            missing_fields(['name', 'email', 'phone', 'address'], data)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=402)
    
        if models.Users.objects.filter(email=data['email']).exclude(email=user.email).exists():
            response = JsonResponse({'error': 'email already exists'})
            response.status_code = 401
            return response

#check if email already exists
        if models.Users.objects.filter(phone=data['phone']).exclude(phone=user.phone).exists():
            response = JsonResponse({'error': 'phone already exists'})
            response.status_code = 401
            return response
        
        
        
        user.name = data['name']
        user.email = data['email']
        user.address = data['address']
        user.phone = data['phone']
        
        if user.car:
            if 'licence' not in data or 'carModel' not in data or 'carColor' not in data:
                response = JsonResponse({'error': 'licence, carmodel and color are required'})
                response.status_code = 402
                return response
            car=user.car
            car.licence = data['licence']
            car.carmodel = data['carModel']
            car.color = data['carColor']
        if user.car is None and data["licence"] and data["carModel"] and data["carColor"]:
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

       

        return JsonResponse({"response": "good"},status=200)

@csrf_exempt
def walletaction(request):
#to add or withdraw money from the user's wallet

    try:
        validate_request_method(request, ['POST'])
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)
    
    try:
        user =  validate_auth_token(request)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=401)
    
    data = json.loads(request.body)
    try:
        missing_fields(['amount', 'action'], data)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=402)

    
    amount = data['amount']
    action = data['action']
    if action == 'topup':
        user.wallet += float(amount)
        user.save()
        WalletHistory.objects.create(user=user, deduction_or_addition='topup', amount=amount, date=datetime.now())
        return JsonResponse({'success': 'money added'}, status=200)
    elif action == 'withdraw':
        try:
            if CurrentRequest.objects.filter(requester=user).exists() or ActiveRides.objects.filter(requester=user).exists():
                response = JsonResponse({'error': 'cannot withdraw while on a ride'})
                response.status_code = 403
                return response
        except:
            pass
            
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
#return the user's transaction history
    try:
        validate_request_method(request, ['GET'])
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)
    
    try:
        user =  validate_auth_token(request)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=401)
    
    history=WalletHistory.objects.filter(user=user).order_by('-date')
    if len(history)==0:
        return JsonResponse([],status=200, safe=False)
    data=[]
    for i in history:
        data.append({'action':i.deduction_or_addition,'amount':i.amount,'date':i.date})
    return JsonResponse(data,status=200, safe=False)
@csrf_exempt
def wallet(request):
#return the user's wallet balance
    try:
        validate_request_method(request, ['GET'])
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)
    
    try:
        user =  validate_auth_token(request)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=401)
    
    
    wallet = user.wallet
    return JsonResponse({'wallet': wallet}, status=200)
@csrf_exempt
def servicehistory(request):
#return the user's service history
#as both requester or responder(driver)
    try:
        validate_request_method(request, ['GET'])
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)
    

    try:
        user =  validate_auth_token(request)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=401)
    
    
    requester_history=ServiceHistory.objects.filter(requester=user).order_by('-time_completed')
    responder_history=ServiceHistory.objects.filter(responder=user).order_by('-time_completed')
    data=[]
    print("before end")
    for i in requester_history:
        data.append({'type': 0, 'requester':i.requester.username,'responder':i.responder.username,'requester_rating':i.requester_rating,'responder_rating':i.responder_rating,'feedback_to_driver':i.feedback_to_driver,'feedback_to_requester':i.feedback_to_requester,'transaction_amount':i.transaction_amount,'service_type':i.service_type,'time_started':i.time_started,'time_accepted':i.time_accepted,'time_pickup':i.time_pickup,'time_completed':i.time_completed,'pickup_latitude':i.pickup_latitude,'pickup_longitude':i.pickup_longitude,'pickup_place_name':i.pickup_place_name,'end_latitude':i.end_latitude,'end_longitude':i.end_longitude,'end_place_name':i.end_place_name,'distance':i.distance,'duration':i.duration})
    for i in responder_history:
        data.append({'type': 1, 'requester':i.requester.username,'responder':i.responder.username,'requester_rating':i.requester_rating,'responder_rating':i.responder_rating,'feedback_to_driver':i.feedback_to_driver,'feedback_to_requester':i.feedback_to_requester,'transaction_amount':i.transaction_amount,'service_type':i.service_type,'time_started':i.time_started,'time_accepted':i.time_accepted,'time_pickup':i.time_pickup,'time_completed':i.time_completed,'pickup_latitude':i.pickup_latitude,'pickup_longitude':i.pickup_longitude,'pickup_place_name':i.pickup_place_name,'end_latitude':i.end_latitude,'end_longitude':i.end_longitude,'end_place_name':i.end_place_name,'distance':i.distance,'duration':i.duration})
    print("until end")
    print("data: ", data)
    return JsonResponse(data,status=200, safe=False)