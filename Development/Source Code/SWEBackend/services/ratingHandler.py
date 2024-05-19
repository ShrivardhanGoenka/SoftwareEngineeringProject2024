from services import models

#Function to handle rating of the user
#The function takes in the user_rated_role, rating and user_rated
#The function then calculates the new rating of the user and updates the database
#The function is called when a user rates another user
#Take curent rating of the user and multiply it by the number of rides the user has taken
#Add the new rating to the total and divide by the number of rides the user has taken
#Update the rating of the user in the database
def ratingmanager(user_rated_role,rating,user_rated):
    if user_rated_role=='requester':
        try:
            rides=models.ServiceHistory.objects.filter(requester=user_rated)
            count=0
            count = len(rides)
        except:
            count=1

        try:
            total=models.RequesterRating.objects.get(user=user_rated).rating*(count-1)
        except:
            total=0
        total+=float(rating)
        total=total/(count)
        try:
            rating=models.RequesterRating.objects.get(user=user_rated)
        except:
            rating=models.RequesterRating(user=user_rated)
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

        try:
            total=models.ResponderRating.objects.get(user=user_rated).rating*(count-1)
        except:
            total=0 
        total+=float(rating)
        total=total/(count)
        try:
            rating=models.ResponderRating.objects.get(user=user_rated)
        except:
            rating=models.ResponderRating(user=user_rated)
        rating.rating=total
        rating.save()
        return