from django.contrib import admin
from .models import *

# Register your models here.

admin.site.register(UserProfile)
admin.site.register(Dish)
admin.site.register(Dish_language)
admin.site.register(Meal)
admin.site.register(Meal_language)
admin.site.register(UserProfileHistory)
admin.site.register(NP)
admin.site.register(NPmeal)


