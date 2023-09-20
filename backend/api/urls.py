from django.urls import path
from django.contrib.auth import views
from rest_framework_simplejwt import views as jwt_views
from . import views

urlpatterns = [

    path('login', views.Login, name='login'),
    path('register', views.Register, name='register'),
    path('IdUserProfile/<str:pk>/', views.IdUserProfile, name='IdUserProfile'),
    
    path('<str:userid>/<str:weekMonday>/<str:weekSunday>/createNPs', views.CreateNPs, name='createNPs'),
    path('<str:userid>/<str:weekMonday>/getCurrentWeekNPs', views.getCurrentWeekNPs, name='getCurrentWeekNPs'),
    path('<str:userid>/<str:weekMonday>/updateCurrentWeekNPs', views.updateCurrentWeekNPs, name='updateCurrentWeekNPs'),
    path('<str:userid>/<str:week>/getPreviousWeekNPs', views.getPreviousWeekNPs, name='getPreviousWeekNPs'),
    path('<str:userid>/<str:week>/getNextWeekNPs', views.getNextWeekNPs, name='getNextWeekNPs'),
    path('<str:userid>/getWeeks', views.getWeeks, name='getWeeks'),

    path('<str:userid>/getUserHistory', views.getUserHistory, name='getUserHistory'),
    path('<str:userid>/<str:weekMonday>/getWeeklyNPs', views.getWeeklyNPs, name='getWeeklyNPs'),

    path('token/', jwt_views.TokenObtainPairView.as_view(), name ='token_obtain_pair'),
    path('token/refresh/', jwt_views.TokenRefreshView.as_view(), name ='token_refresh'),
    path('blacklist_token', views.blacklistToken, name='blacklist_token'),
]