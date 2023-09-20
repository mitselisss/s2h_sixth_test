import pandas as pd
from django.core.exceptions import ObjectDoesNotExist
from api.models import Dish, Dish_language

def run():
    #df = pd.read_csv("Meals.csv")
    df = pd.read_csv('C:/Users/kyrikalp/Desktop/S2Hcodes/S2H_final_v01/backend/scripts/Dishes_lang.csv')

    for index, row in df.iterrows():
        #print(index, row)
        dish_id = row['ID']

        try:
            dish = Dish_language.objects.get(id=dish_id)
        except ObjectDoesNotExist:
            flag = True
            dish = Dish_language(id=dish_id)
            
            dish.id = row['ID']
            if pd.isna(row['Dish_id']) is False:
                Dish_id = Dish.objects.get(id = row['Dish_id'])
                dish.dish_id = Dish.objects.get(id = Dish_id.id)
            dish.language = row['Language']
            dish.name = row['Name']
            dish.ingredients_adult = row['Ingredients of a standard portion for an adult']
            dish.recipe = row['Recipe']
            dish.tip = row['Tip']
            

            if flag:  
                dish.save()