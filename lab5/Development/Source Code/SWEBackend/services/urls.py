"""SWEBackend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.urls import path, include
from . import views

urlpatterns = [ 
    path('request', view=views.request),
    path('drive', view=views.drive), 
    path('cancel', view=views.cancel),
    path('accept', view=views.accept),
    path('pickup', view=views.pickup),
    path('dropoff', view=views.dropoff),
    path('requesterupdates', view=views.requesterupdates),
    path('rating', view=views.rating),
    path('current_ride_info', view=views.current_ride_info),
    path('anyrides', view=views.anyrides),
    path('current_request_info', view=views.getCurrentRequestDetails),
    path('responderstatus', view=views.getResponderStatus),
    path('getServiceIdByTimeStarted', view=views.getServiceIdByTimeStarted),
    path("chat", view=views.chat),
    path("get_rating", view=views.get_rating),
]   
