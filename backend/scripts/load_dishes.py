import pandas as pd
from django.core.exceptions import ObjectDoesNotExist
from api.models import Dish

def run():
    #df = pd.read_csv("Meals.csv")
    df = pd.read_csv('C:/Users/kyrikalp/Desktop/S2Hcodes/S2H_final_v01/backend/scripts/Dishes.csv')

    for index, row in df.iterrows():
        #print(index, row)
        dish_id = row['ID']

        try:
            dish = Dish.objects.get(id=dish_id)
        except ObjectDoesNotExist:
            flag = True
            dish = Dish(id=dish_id)
            
            dish.id = row['ID']

            if pd.isna(row['Kcal']) is False:
                dish.kcal = row['Kcal']
            else:
                flag = False
            if pd.isna(row['Protein']) is False:
                dish.protein = row['Protein']
            else:
                flag = False
            if pd.isna(row['Fat']) is False:
                dish.fat = row['Fat']
            else:
                flag = False
            if pd.isna(row['Carbohydrates']) is False:
                dish.carbohydrates = row['Carbohydrates']
            else:
                flag = False

            dish.autumn = row['For Autumn']
            dish.winter = row['For Winter']
            dish.spring= row['For Spring']
            dish.summer = row['For Summer']
            dish.white_meat = row['White meat']
            dish.red_meat = row['Red meat']
            dish.pork = row['Pork']
            dish.fish = row['Fish or seafood']
            dish.pulses = row['Pulses (Legumes)']
            dish.diary = row['Dairy']
            dish.eggs = row['Eggs']
            dish.pasta = row['Pasta']
            dish.rice = row['Rice']
            dish.tubers = row['Tubers']
            dish.soups = row['Soups']
            dish.cereals = row['Cereals']
            dish.fruit = row['Fruit']
            dish.nuts = row['Nuts']
            dish.raw_vegetables = row['Raw vegetables']
            dish.cooked_vegetables = row['Cooked vegetables']
            dish.protein_mix = row["Protein mix"]
            dish.unique = row["Unique"]
            dish.semi_unique = row["Semiunique"]
            dish.vegetables_semi = row["Vegetables for semi"]
            dish.red = row["Red"]
            dish.green = row["Green"]
            dish.white = row["White"]
            dish.yellow = row["Yellow"]
            dish.purple = row["Purple"]
            dish.multicolor = row["Multicolor"]
            dish.no_color = row["No color"] 

            if flag:  
                dish.save()