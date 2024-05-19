import requests
from django.db import connection
from services import models

#Api call to google maps to get the route details
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

#Function to fetch all the pending requests from the database
def fetch_pending_requests():
    with connection.cursor() as cursor:
        cursor.execute("SELECT * FROM services_currentrequest")
        rows = cursor.fetchall()
    return rows

#Function to process all the pending requests
#Parse all the current requests from database using the fetch_pending_requests function
#For each request, call the compute_routes function to get the route details
#Extract the required data from the route details and create a result dictionary
#Return the result dictionary
#Sort the result dictionary based on the duration and return the top 3 shortest routes
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
            userrating = round(current_request.user_rating, 1)
            
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
                "rideDuration": rideduration,
                "userRating": userrating
            }

    shortest_routes = sorted(results.items(), key=lambda x: int(x[1].get('durationMinutes', 0)))
    shortest_routes=shortest_routes[:3]


    return shortest_routes