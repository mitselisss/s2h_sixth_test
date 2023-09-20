import pandas as pd
from django.core.exceptions import ObjectDoesNotExist
from api.models import Meal, Dish, Meal_language

def run():
    #df = pd.read_csv("Meals.csv")
    df = pd.read_csv('C:/Users/kyrikalp/Desktop/S2Hcodes/S2H_final_v01/backend/scripts/Meals_lang.csv')

    for index, row in df.iterrows():
        #print(index, row)
        meal_id = row['ID']
        try:
            meal = Meal_language.objects.get(id=meal_id)
        except ObjectDoesNotExist:
            meal = Meal_language(id=meal_id)

        meal.id = row['ID']
        if pd.isna(row['Meal_id']) is False:
                Meal_id = Meal.objects.get(id = row['Meal_id'])
                meal.meal_id = Meal.objects.get(id = Meal_id.id)
        meal.language = row['Language']
        meal.name = row['Name']
        
        meal.save()