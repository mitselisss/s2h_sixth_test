from rest_framework import serializers
from api.models import *
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model=User
        fields='__all__'

class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    class Meta:
        model = UserProfile
        fields = '__all__'

class RegisterUserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    class Meta:
        model = UserProfile
        fields = ('user', 'gender', 'height', 'weight', 'yob', 'pal', 'halal', 'diary', 'eggs', 'fish', 'nuts', 'country', 'countryLanguageCode')

class UpdateUserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ('gender', 'height', 'weight', 'yob', 'pal', 'halal', 'diary', 'eggs', 'fish', 'nuts', 'country', 'countryLanguageCode')

class getUseProfileHistorySerializer(serializers.ModelSerializer):

    class Meta:
        model = UserProfileHistory
        fields = ('updated_at', 'weight')
        
class DishLanguageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dish_language
        fields = ('dish_id', 'language', 'name', "ingredients_adult", "recipe", "tip")

class DishSerializer(serializers.ModelSerializer):

    dish_language_info = serializers.SerializerMethodField()

    class Meta:
        model=Dish
        fields=('id', 'dish_language_info', 'kcal', 'fat', 'protein', 'carbohydrates')

    def get_dish_language_info(self, obj):
        language = self.context.get('language')
        dish_language = Dish_language.objects.filter(dish_id=obj.id, language=language)
        serializer = DishLanguageSerializer(dish_language, many=True)
        return serializer.data


class MealLanguageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Meal_language
        fields = '__all__'

class MealSerializer(serializers.ModelSerializer):

    dish_1 = DishSerializer()
    dish_2 = DishSerializer()
    dish_3 = DishSerializer()
    dish_4 = DishSerializer()
    dish_5 = DishSerializer()
    dish_6 = DishSerializer()
    dish_7 = DishSerializer()
    dish_8 = DishSerializer()
    dish_9 = DishSerializer()
    dish_10 = DishSerializer()
    
    meal_language_info = serializers.SerializerMethodField()

    class Meta:
        model = Meal
        fields = ('id', 'meal_language_info', 'dish_1', 'dish_2', 'dish_3', 'dish_4', 'dish_5', 'dish_6', 'dish_7', 'dish_8', 'dish_9', 'dish_10',
                  'type', 'country')

    def get_meal_language_info(self, obj):
        language = self.context.get('language')
        meal_language = Meal_language.objects.filter(meal_id=obj.id, language=language)
        serializer = MealLanguageSerializer(meal_language, many=True)
        return serializer.data
    

class loadNPsSerializer(serializers.ModelSerializer):
    meals = serializers.SerializerMethodField()

    class Meta:
        model = NP
        fields = '__all__'

    def get_meals(self, instance):
        language = self.context.get('language')
        meal_serializer = MealSerializer(instance.meals.all(), many=True, context={'language': language})
        return meal_serializer.data
