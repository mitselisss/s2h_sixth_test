import time
import random
import itertools
from django.db.models import Count
from .models import *
from .serializers import *
from django.utils import timezone
from django.db.models import Max
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from rest_framework.decorators import api_view
from django.http import JsonResponse
from django.contrib.auth.hashers import make_password, check_password
from rest_framework_simplejwt.tokens import RefreshToken

 

@api_view(['POST'])
def Login(request):

      if request.method == "POST":
        data = request.data
        email = data["email"]
        password = data["password"]
        
        try:
            user = User.objects.get(email=email)
            if user and check_password(password, user.password):
                data_dict = {'emai': email, 'username': user.username, 'password': password}
                serializer = UserSerializer(instance=user, data=data_dict)
                if serializer.is_valid():
                    refresh = RefreshToken.for_user(user)
                    return Response({
                        'access_token': str(refresh.access_token),
                        'refresh_token': str(refresh)
                })
            else:
                return JsonResponse({'error': 'Wrong credentials'}, status=400)
        except:
            return JsonResponse({'error': 'Username does not exist. You must sign up first'}, status=400)
    

@api_view(['POST'])
def Register(request):
    
    if request.method == 'POST':
        data = request.data
        username = data["username"]
        email = data["email"]
        password = data["password"]
        password2 = data["password2"]

        try:
            user = User.objects.get(username=username)
            return JsonResponse({'error': "Username already exist"}, status=400)     
        except:
            try:
                user = User.objects.get(email = email)
                return JsonResponse({'error': "Email already exist"}, status=400) 
            except:
                try:
                    validate_password(password)
                    validate_password(password2)
                    if password == password2:
                        password = make_password(data['password']) 
                        data_dict = {'email': email, 'username': username, 'password': password}
                        serializer = UserSerializer(data=data_dict)
                        if serializer.is_valid():
                            serializer.save()
                            user = User.objects.get(username=username)
                            profile = UserProfile(user = user, gender='male', yob=1994, height=1.88, weight=85, pal='Active', halal=False, diary=False, eggs=False, fish=False, country='Spain', countryLanguageCode='sp', age=29, bmi=1, bmr=1, energy_intake=1)
                            profile.save()
                            refresh = RefreshToken.for_user(user)
                            return Response({
                                'access_token': str(refresh.access_token),
                                'refresh_token': str(refresh)
                            })
                    else:
                        return JsonResponse({'error': "Passowrd and comfirm password do not match"}, status=400)
                except:
                    return JsonResponse({'error': "Invalid password. Please check for the password validations"}, status=400)


@api_view(['POST'])
def blacklistToken(request):
    if request.method == 'POST':
        
        # Blacklist all outstanding tokens for the user
        RToken = request.data['authTokens']['refresh_token']
        token = RefreshToken(RToken)
        token.blacklist()

    return JsonResponse('Token blaclisted successfully.', safe=False)


@api_view(['GET', 'POST', 'PUT'])
def IdUserProfile(request, pk):
    
    if request.method == 'GET':
        user = UserProfile.objects.get(user = pk)
        serializer = UserProfileSerializer(instance=user)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        user = User.objects.get(id = pk)
        userProfile = UserProfile.objects.get(user = user)
        serializer = UpdateUserProfileSerializer(instance=userProfile, data=request.data)
        #print(request.data)
        #print(serializer)
        if serializer.is_valid():
            serializer.save()

            # Create UserProfileHistory instance for the historical record
            UserProfileHistory.objects.create(
                user = user,
                userProfile = userProfile,
                gender = request.data["gender"],
                yob = request.data["yob"],
                height = request.data["height"],
                weight = request.data["weight"],
                pal = request.data["pal"],
                halal = request.data["halal"],
                diary = request.data["diary"],
                eggs = request.data["eggs"],
                fish = request.data["fish"],
                nuts = request.data["nuts"],
                country = request.data["country"],
                countryLanguageCode = request.data["countryLanguageCode"],
                updated_at = timezone.now(),
            )

        return Response(serializer.data)
    
    elif request.method == 'POST':
        
        user = User.objects.get(id = pk)
        data = request.data

        serializer = RegisterUserProfileSerializer(data = data)
        if serializer.is_valid():
            serializer.save()
        return Response(serializer.data)

@api_view(['GET'])
def getUserHistory(request, userid):

    if request.method == 'GET':
        user = User.objects.get(id = userid)
        userProfileHistory  = UserProfileHistory.objects.filter(user = user)
        #print(userProfileHistory)

        if len(userProfileHistory) > 5:
            serializer = getUseProfileHistorySerializer(userProfileHistory[:5], many=True)
        else:
            serializer = getUseProfileHistorySerializer(userProfileHistory, many=True)

        #serializer = getUseProfileHistorySerializer(userProfileHistory, many=True)
        return Response(serializer.data)
   
@api_view(['GET'])
def getCurrentWeekNPs(request, userid, weekMonday):

    if request.method == 'GET':
        user = User.objects.get(id = userid)
        userProfile = UserProfile.objects.get(user = user)
        language = userProfile.countryLanguageCode
        NPs = NP.objects.filter(user = user, start_date = weekMonday)

        #week_count = NP.objects.filter(user=user).values('week').annotate(week_count=Count('week')).count()

        serializer = loadNPsSerializer(NPs, many=True, context={'language': language})
        return Response(serializer.data)

@api_view(['GET'])
def CreateNPs(request, userid, weekMonday, weekSunday):

    start = time.time()

    # Get all the user info we need in order to produce the NPs
    user = User.objects.get(id = userid)
    userProfile = UserProfile.objects.get(user = user) 
    language = userProfile.countryLanguageCode 

    energy_intake = userProfile.energy_intake
    #energy_intake = 2800
    
    # Get all the meals for a user according to user country
    meals = Meal.objects.filter(country = userProfile.country).all()

    # Exclude meals according to user preferences
    allergy_filters = {
    'pork': userProfile.halal,
    'diary': userProfile.diary,
    'eggs': userProfile.eggs,
    'fish': userProfile.fish,
    'nuts': userProfile.nuts,
    }

    for allergy, is_filtered in allergy_filters.items():
        if is_filtered:
            for i in range(1, 6):
                meals = meals.exclude(**{f'dish_{i}__{allergy}': True})

    # Filter meals according to period
    month = weekMonday.split('-')[1]
    #print(month)

    winter_list = ['12', '01', '02']
    auturn_list = ['03', '04', '05']
    summer_list = ['06', '07', '08']
    spring_list = ['09', '10', '11']

    if month in winter_list:
        meals = meals.filter(winter = True).all()
        #print("edw1")
    elif month in auturn_list:
        meals = meals.filter(auturn = True).all()
        #print("edw2")
    elif month in summer_list:
        meals = meals.filter(summer = True).all()
        #print("edw3")
    elif month in spring_list:
        meals = meals.filter(spring = True).all()
        #print("edw3")
    
    # Create all possible combination of meals and keep only x number of them
    all_list = [meals.filter(type=meal_type) for meal_type in ('Breakfast', 'Morning_Snack', 'Lunch', 'Afternoon_Snack', 'Dinner')]
    r = list(itertools.product(*all_list))
    # res = random.choices(r, k=200000)
    res = r 

    step1_start = time.time()
    # Get the meal characteristics of the x meals
    meal_info_dict = get_meal_info_dict(res)
    # Sum the NPs characteristics
    NP_info_dict = sum_NPs_characteristics(res, meal_info_dict)
    step1_end = time.time()
    step1_elapsed_time = step1_end-step1_start

    step2_start = time.time()
    # Score the NPs
    NP_score_dict = score_NPs(energy_intake, res, NP_info_dict)
    # Sort the NPs according to appropriateness distance
    sorted_NP_score_dict = dict(sorted(NP_score_dict.items(), key=lambda x: x[1]['appropriateness_distance']))
    step2_end = time.time()
    step2_elapsed_time = step2_end-step2_start

    step3_start = time.time()
    # Keep the top 7 NPs after 2 diversity filters
    final_meals = NPs_diversity(sorted_NP_score_dict, allergy_filters)
    step3_end = time.time()
    step3_elapsed_time = step3_end-step3_start

    last_week = NP.objects.filter(user=user).aggregate(latest_week=Max('week'))['latest_week']
    # print("last week:", last_week)
    if last_week is None:
        week=1
    else:
        week = last_week + 1
    # print("new week:", week)

    day = 1
    for meals in final_meals:
        np = NP.objects.create(user=user, UserProfile=userProfile, start_date=weekMonday, end_date=weekSunday, week=week, day=day)
        day += 1

        meal_number = 1
        for meal_id in meals:
            meal = Meal.objects.get(id = meal_id)
            NPmeal.objects.create(np=np, meal=meal, meal_number=meal_number)
            meal_number += 1

    end = time.time()
    elapsed_time = end-start

    #print("elapsed_time:", elapsed_time)
    #print("elapsed1_time:", step1_elapsed_time)
    #print("elapsed2_time:", step2_elapsed_time)
    #print("elapsed3_time:", step3_elapsed_time)

    NPs = NP.objects.filter(user = user, start_date = weekMonday)
    serializer = loadNPsSerializer(NPs, many=True, context={'language': language})
    return Response(serializer.data)

    
@api_view(['PUT'])
def updateCurrentWeekNPs(request, userid, weekMonday):

    if request.method == 'PUT':
        
        start = time.time()

        # Get all the user info we need in order to produce the NPs
        user = User.objects.get(id = userid)
        userProfile = UserProfile.objects.get(user = user) 
        language = userProfile.countryLanguageCode 

        energy_intake = userProfile.energy_intake
        #energy_intake = 2800
        
        # Get all the meals for a user according to user country
        meals = Meal.objects.filter(country = userProfile.country).all()
        #print(len(meals))

        # Exclude meals according to user preferences
        allergy_filters = {
        'pork': userProfile.halal,
        'diary': userProfile.diary,
        'eggs': userProfile.eggs,
        'fish': userProfile.fish,
        'nuts': userProfile.nuts,
        }

        for allergy, is_filtered in allergy_filters.items():
            if is_filtered:
                for i in range(1, 6):
                    meals = meals.exclude(**{f'dish_{i}__{allergy}': True})

        # Filter meals according to period
        month = weekMonday.split('-')[1]
        #print(month)

        winter_list = ['12', '01', '02']
        auturn_list = ['03', '04', '05']
        summer_list = ['06', '07', '08']
        spring_list = ['09', '10', '11']

        if month in winter_list:
            meals = meals.filter(winter = True).all()
            #print("edw1")
        elif month in auturn_list:
            meals = meals.filter(auturn = True).all()
            #print("edw2")
        elif month in summer_list:
            meals = meals.filter(summer = True).all()
            #print("edw3")
        elif month in spring_list:
            meals = meals.filter(spring = True).all()
            #print("edw3")
        
        
        # Create all possible combination of meals and keep only x number of them
        all_list = [meals.filter(type=meal_type) for meal_type in ('Breakfast', 'Morning_Snack', 'Lunch', 'Afternoon_Snack', 'Dinner')]
        r = list(itertools.product(*all_list))
        #res = random.choices(r, k=80000)
        res = r 

        step1_start = time.time()
        # Get the meal characteristics of the x meals
        meal_info_dict = get_meal_info_dict(res)
        # Sum the NPs characteristics
        NP_info_dict = sum_NPs_characteristics(res, meal_info_dict)
        step1_end = time.time()
        step1_elapsed_time = step1_end-step1_start

        step2_start = time.time()
        # Score the NPs
        NP_score_dict = score_NPs(energy_intake, res, NP_info_dict)
        # Sort the NPs according to appropriateness distance
        sorted_NP_score_dict = dict(sorted(NP_score_dict.items(), key=lambda x: x[1]['appropriateness_distance']))
        step2_end = time.time()
        step2_elapsed_time = step2_end-step2_start

        step3_start = time.time()
        # Keep the top 7 NPs after 2 diversity filters
        final_meals = NPs_diversity(sorted_NP_score_dict, allergy_filters)
        step3_end = time.time()
        step3_elapsed_time = step3_end-step3_start


        # print(user)
        # print(userProfile)
        # print(weekMonday)

        day = 1
        for meals in final_meals:
            
            np = NP.objects.get(user=user, UserProfile=userProfile, start_date=weekMonday, day=day)
            #print("#####")
            #print("np", np)

            meal_number = 1
            for meal in meals:
                npmeal = NPmeal.objects.get(np=np, meal_number=meal_number)
                #print(npmeal)
                #print('previous meal', npmeal.meal)
                meal = Meal.objects.get(id = meal)
                #print('current meal', meal)
                npmeal.meal = meal
                npmeal.save()
                meal_number += 1

            day += 1


        NPs = NP.objects.filter(user = user, start_date = weekMonday)
        serializer = loadNPsSerializer(NPs, many=True, context={'language': language})
        return Response(serializer.data)

    
@api_view(['GET'])
def getPreviousWeekNPs(request, userid, week):

    if request.method == 'GET':
        user = User.objects.get(id = userid)
        userProfile = UserProfile.objects.get(user = user) 
        language = userProfile.countryLanguageCode

        weeks = set(NP.objects.filter(user=user).order_by('week').values_list('week', flat=True))
        weeks_list = sorted(list(weeks))
        target = weeks_list.index(int(week))
 
        if target-1 < 0:
            previous_week = week
        else:
            previous_week = weeks_list[target+-1] 
        
        NPs = NP.objects.filter(user = user, week = previous_week)

        serializer = loadNPsSerializer(NPs, many=True, context={'language': language})
        return Response(serializer.data)
    
@api_view(['GET'])
def getNextWeekNPs(request, userid, week):

    if request.method == 'GET':
        user = User.objects.get(id = userid)
        userProfile = UserProfile.objects.get(user = user) 
        language = userProfile.countryLanguageCode
        
        #last_week = NP.objects.aggregate(latest_week=Max('week'))['latest_week']
        #week_count = NP.objects.filter(user=user).values('week').annotate(week_count=Count('week')).count()
        weeks = set(NP.objects.filter(user=user).order_by('week').values_list('week', flat=True))
        weeks_list = sorted(list(weeks))
        target = weeks_list.index(int(week))
        
        if target+1 > len(weeks_list)-1:
            next_week = week
        else:
            next_week = weeks_list[target+1] 

        NPs = NP.objects.filter(user = user, week = next_week)

        serializer = loadNPsSerializer(NPs, many=True, context={'language': language})
        return Response(serializer.data)
    
@api_view(['GET'])
def getWeeks(request, userid):

    if request.method == 'GET':

        user = User.objects.get(id = userid)
        weeks = set(NP.objects.filter(user=user).order_by('week').values_list('week', flat=True))
        week_count = NP.objects.filter(user=user).values('week').annotate(week_count=Count('week')).count()
        weeks_list = sorted(list(weeks)) 
        week_list_dict = {
            "week_list": weeks_list,
            "week_count": week_count
        }
        return Response(week_list_dict)
    

@api_view(['GET'])
def getWeeklyNPs(request, userid, weekMonday):

    if request.method == 'GET':
        
        user = User.objects.get(id = userid)
        userProfile = UserProfile.objects.get(user = user) 
        energy_intake = userProfile.energy_intake

        NPs = NP.objects.filter(user = user, start_date = weekMonday)
        final_meal_info_dict = get_final_meal_info_dict(NPs)
        final_NP_characteristics = sum_final_NPs_characteristics(NPs, energy_intake, final_meal_info_dict)
        #print(final_NP_characteristics)
            
 
        return Response(final_NP_characteristics)


def get_meal_info_dict(res):
    meal_info_dict = {}
    for NP in res:
        for meal in NP:
            kcal = 0 
            fat = 0
            protein = 0
            fruit = 0
            raw_vegetables = 0
            cooked_vegetables = 0
            legumes = 0
            fish = 0
            nuts = 0
            dish_list = [meal.dish_1, meal.dish_2, meal.dish_3, meal.dish_4, meal.dish_5,
                         meal.dish_6, meal.dish_7, meal.dish_8, meal.dish_9, meal.dish_10]
            dishes = []
            for dish in dish_list:
                if dish is not None:
                    kcal += dish.kcal
                    fat += dish.fat
                    protein += dish.protein
                    if dish.fruit:
                        fruit += 1
                    if dish.raw_vegetables:
                        raw_vegetables += 1
                    if dish.cooked_vegetables:
                        cooked_vegetables += 1
                    if dish.pulses:
                        legumes = True
                    if dish.fish:
                        fish = True
                    if dish.nuts:
                        nuts = True  
                    dishes.append(dish.id)
            meal_info_dict[meal.id] = {
                'kcal': kcal, 
                'fat': fat, 
                'protein':protein, 
                'fruit': fruit, 
                'raw_vegetables': raw_vegetables, 
                'cooked_vegetables': cooked_vegetables, 
                'legumes':legumes, 
                'fish':fish, 
                'nuts': nuts, 
                'dishes': dishes
            }
    #print(meal_info_dict)
    return meal_info_dict

def sum_NPs_characteristics(res, meal_info_dict):
    NP_info_dict = {}
    for i in range(len(res)):
        kcal = 0
        fat = 0
        protein = 0
        fruit = 0
        raw_vegetables = 0
        cooked_vegetables = 0
        frandveg = 0
        legumes = False
        fish = False
        nuts = False
        dishes_list = []
        meals_list = []
        # iterate through each one of the five meals for a specific NP
        for j in range(0,5):
                meal_info = meal_info_dict.get(res[i][j].id)
                kcal += meal_info['kcal']
                fat += meal_info['fat'] * 9
                protein += meal_info['protein'] * 4
                fruit += meal_info['fruit']
                raw_vegetables += meal_info['raw_vegetables']
                cooked_vegetables += meal_info['cooked_vegetables']
                if meal_info['legumes']:
                    legumes = True
                if meal_info['fish']:
                    fish = True
                if meal_info['nuts']:
                    nuts = True 
                dishes_list.append(meal_info['dishes'])
                meals_list.append(res[i][j].id)

        dishes_list = sum(dishes_list, [])
        frandveg = fruit + raw_vegetables + cooked_vegetables
        # check if all dishes in each one of the NPs are unique
        result = len(set(dishes_list)) == len(dishes_list)
        #dishes_div.append(result)
        NP_info_dict[i] = {
            'kcal': kcal, 
            'fat': fat, 
            'protein': protein, 
            'frandveg': frandveg, 
            'has_legumes':legumes, 
            'has_fish':fish, 
            'has_nuts':nuts, 
            'dishes_div': result, 
            'meals_list': meals_list, 
            'dishes_list': dishes_list
            }
    #print(NP_info_dict)
    return NP_info_dict

def score_NPs(energy_intake, res, NP_info_dict):
    
    AWARD_VALUE_ESSENTIAL = 0.001
    AWARD_VALUE = 0.1
    PENALTY_VALUE = 100.0
    CALORIC_LIMIT_MIN = 200.0
    CALORIC_LIMIT_MAX = 500.0
    CALORIC_PENALTY_MIN = 100.0
    CALORIC_PENALTY_MAX = 1000000.0
    NAP_EXCLUSION_VALUE = 10000000.0
    fat_t1 = energy_intake*0.25
    fat_t2 = energy_intake*0.40
    protein_t1 = energy_intake*0.15
    protein_t2 = energy_intake*0.20

    NP_score_dict = {}
    caloric_distance = [0] * len(res)
    fat_distance = [0] * len(res)
    protein_distance = [0] * len(res)
    frandveg_distance = [0] * len(res)
    dishes_distance = [0] * len(res)
    appropriateness_distance = [1] * len(res)

    for i in range(len(res)):

        NP_info = NP_info_dict.get(i)
        kcal = NP_info['kcal']
        fat = NP_info['fat']
        protein = NP_info['protein']
        frandveg = NP_info['frandveg']
        dishes_div = NP_info['dishes_div']
        legumes = NP_info['has_legumes']
        fish = NP_info['has_fish']
        nuts = NP_info['has_nuts']
        meals_list = NP_info['meals_list']
        dishes_list = NP_info['dishes_list']

        # how good is that NP regarding calories
        caloric_distance[i] = abs(kcal - energy_intake)
        if (caloric_distance[i] == 0.0):
            caloric_distance[i] = AWARD_VALUE_ESSENTIAL
        else:
            if caloric_distance[i] > CALORIC_LIMIT_MIN:
                if caloric_distance[i] > CALORIC_LIMIT_MAX:
                    caloric_distance[i] *= CALORIC_PENALTY_MAX
                else:
                    caloric_distance[i] *= CALORIC_PENALTY_MIN
        
        # how good is the NP regarding fats
        fat_distance[i]=1.0
        if fat >= fat_t1 and fat <= fat_t2:
            fat_distance[i] = AWARD_VALUE
        else:
            fat_distance[i] = PENALTY_VALUE

        # how good is the NP regarding protein
        protein_distance[i]=1.0
        if protein >= protein_t1 and protein <= protein_t2:
            protein_distance[i] = AWARD_VALUE
        else:
            protein_distance[i] = PENALTY_VALUE

        # how good is the NP regarding fruits and vegetables
        if frandveg < 5 or frandveg > 10:
            frandveg_distance[i] = PENALTY_VALUE
        else:
            frandveg_distance[i] = AWARD_VALUE
        
        
        # how good is the NP regarding dishes diversity
        if dishes_div == True:
            dishes_distance[i] = AWARD_VALUE
        else:
            dishes_distance[i] = NAP_EXCLUSION_VALUE

        appropriateness_distance[i] *= caloric_distance[i]
        appropriateness_distance[i] *= fat_distance[i]
        appropriateness_distance[i] *= protein_distance[i]
        appropriateness_distance[i] *= frandveg_distance[i]
        appropriateness_distance[i] *= dishes_distance[i]

        NP_score_dict[i] = {
        'appropriateness_distance': appropriateness_distance[i],
        'has_legumes':legumes, 
        'has_fish':fish, 
        'has_nuts':nuts, 
        'meals_list': meals_list, 
        'dishes_list': dishes_list
        }
    #print(NP_score_dict)
    return NP_score_dict

def NPs_diversity(sorted_NP_score_dict, allergy_filters):

    noemis_list = []
    d_meals_id = []
    d_unique_meals = []
    d_not_unique_meals = []
    cnt_legumes=0
    cnt_fish=0
    cnt_nuts=0

    # Noemis rules
    # for key in sorted_NP_score_dict:

    #     flag_legumes = False
    #     flag_nuts = False
    #     flag_fish  = False
    #     sorted_NPs = sorted_NP_score_dict[key]
    #     meals_list = sorted_NPs['meals_list']
    #     has_legumes = sorted_NPs['has_legumes']
    #     has_fish = sorted_NPs['has_fish']
    #     has_nuts = sorted_NPs['has_nuts']

    #     if has_legumes and cnt_legumes<3:
    #         cnt_legumes += 1
    #         noemis_list.append(meals_list)
    #         d_meals_id.append(meals_list[0])
    #         d_meals_id.append(meals_list[1])
    #         d_meals_id.append(meals_list[2])
    #         d_meals_id.append(meals_list[3])
    #         d_meals_id.append(meals_list[4]) 
    #         d_unique_meals.append(meals_list)
    #         flag_legumes = True
    #     if has_nuts and cnt_nuts<3:
    #         cnt_nuts += 1
    #         if not flag_legumes:
    #             noemis_list.append(meals_list)
    #             d_meals_id.append(meals_list[0])
    #             d_meals_id.append(meals_list[1])
    #             d_meals_id.append(meals_list[2])
    #             d_meals_id.append(meals_list[3])
    #             d_meals_id.append(meals_list[4]) 
    #             d_unique_meals.append(meals_list)
    #             flag_nuts = True
    #     if has_fish and cnt_fish<3:
    #         cnt_fish += 1
    #         if not flag_legumes and not flag_nuts:
    #             noemis_list.append(meals_list)
    #             d_meals_id.append(meals_list[0])
    #             d_meals_id.append(meals_list[1])
    #             d_meals_id.append(meals_list[2])
    #             d_meals_id.append(meals_list[3])
    #             d_meals_id.append(meals_list[4]) 
    #             d_unique_meals.append(meals_list)
    #             flag_fish = True
        
    #     #print('meals_list:', meals_list)
    #     #print('has_legumes:', has_legumes)
    #     #print('cnt_legumes:', cnt_legumes)
    #     #print('has_nuts:', has_nuts)
    #     #print('cnt_nuts:', cnt_nuts)
    #     #print('has_fish:', has_fish)
    #     #print('has_fish:', cnt_fish)
    #     #print("###########")

    #     if allergy_filters['fish'] == True:
    #         if cnt_legumes==3 and cnt_nuts==3:
    #             break
    #     elif allergy_filters['nuts'] == True:
    #         if cnt_legumes==3 and cnt_fish==3:
    #             break
    #     else:    
    #         if cnt_legumes==3 and cnt_fish==3 and cnt_nuts==3:
    #             break
    
    # # print('noemis list:', noemis_list)
    # #print('d_unique_meals:', d_unique_meals)

    # Diversity step 1!!!
    counter = 0
    for key in sorted_NP_score_dict:
        sorted_NPs = sorted_NP_score_dict[key]
        meals_list = sorted_NPs['meals_list']

        cnt = 0
        for j in range(5):
            x = d_meals_id.count(meals_list[j])
            if (meals_list[j] not in d_meals_id) or (x<3):
                cnt += 1
        if cnt == 5:
            d_meals_id.append(meals_list[0])
            d_meals_id.append(meals_list[1])
            d_meals_id.append(meals_list[2])
            d_meals_id.append(meals_list[3])
            d_meals_id.append(meals_list[4]) 
            d_unique_meals.append(meals_list)
        else:
            d_not_unique_meals.append(meals_list)
        #counter += 1
        #if counter == 14:
        #    break
    # print(d_unique_meals)
    # print(d_not_unique_meals[:10])   

    # Diversity step 2!!!
    d_list1 = []
    d_list1.append(d_meals_id[:5])
    d_final_meals = []
    d_final_meals.append(d_unique_meals[0])
    for j in range(5, len(d_meals_id), 5):
        d_list2 = d_meals_id[j:j+5]
        d_set2 = set(d_list2)
        cnt = 0
        for i in range(0, len(d_list1)):
            d_set1 = set(d_list1[i])
            similarity = len(d_set1.intersection(d_set2)) / len(d_set1.union(d_set2))
            if similarity < 0.4:
                cnt += 1
        if cnt == len(d_list1):
            d_list1.append(d_list2)
            d_final_meals.append(d_unique_meals[int(j/5)])
            if len(d_final_meals) == 7:
                break; 
    
    # if final meals are not 7 add from the not unique meals
    if len(d_final_meals) == 7:
        pass
    else:
        diff = 7-len(d_final_meals)
        for i in diff:
            d_final_meals.append(d_not_unique_meals[i])
    
    # print('final meals', d_final_meals)
    random.shuffle(d_final_meals)
    #print('random final meals', d_final_meals)

    return d_final_meals


def get_final_meal_info_dict(NPs):
    final_meal_info_dict = {}
    for np in NPs:
        npmeals = NPmeal.objects.filter(np=np).values_list('meal')
        for meal_id in npmeals:
            meal = Meal.objects.get(id = meal_id[0])
            kcal = 0 
            fat = 0
            protein = 0
            carbs = 0
            fruit = 0
            raw_vegetables = 0
            cooked_vegetables = 0
            legumes = 0
            fish = 0
            nuts = 0
            dish_list = [meal.dish_1, meal.dish_2, meal.dish_3, meal.dish_4, meal.dish_5,
                        meal.dish_6, meal.dish_7, meal.dish_8, meal.dish_9, meal.dish_10]
            dishes = []
            for dish in dish_list:
                if dish is not None:
                    kcal += dish.kcal
                    fat += dish.fat
                    protein += dish.protein
                    carbs += dish.carbohydrates
                    if dish.fruit:
                        fruit += 1
                    if dish.raw_vegetables:
                        raw_vegetables += 1
                    if dish.cooked_vegetables:
                        cooked_vegetables += 1
                    if dish.pulses:
                        legumes += 1
                    if dish.fish:
                        fish += 1
                    if dish.nuts:
                        nuts += 1   
                    
            final_meal_info_dict[meal.id] = {
                'kcal': kcal, 
                'fat': fat, 
                'protein':protein,
                'carbs':carbs,  
                'fruit': fruit, 
                'raw_vegetables': raw_vegetables, 
                'cooked_vegetables': cooked_vegetables, 
                'legumes':legumes, 
                'fish':fish, 
                'nuts': nuts, 
                'dishes': dishes
                }
    
    return final_meal_info_dict   
    
def sum_final_NPs_characteristics(NPs, energy_intake, final_meal_info_dict):
    NP_info_dict = {}
    i = 1
    for np in NPs:
        kcal = 0
        fat = 0
        protein = 0
        carbs = 0
        fruit = 0
        raw_vegetables = 0
        cooked_vegetables = 0
        legumes = 0
        fish = 0
        nuts = 0
        # iterate through each one of the five meals for a specific NP
        npmeals = NPmeal.objects.filter(np=np).values_list('meal')
        for meal_id in npmeals:
                meal_info = final_meal_info_dict.get(meal_id[0])
                kcal += meal_info['kcal']
                fat += meal_info['fat'] 
                protein += meal_info['protein']
                carbs += meal_info['carbs']
                fruit += meal_info['fruit']
                raw_vegetables += meal_info['raw_vegetables']
                cooked_vegetables += meal_info['cooked_vegetables']
                legumes += meal_info['legumes']
                fish += meal_info['fish']
                nuts += meal_info['nuts']
                
        NP_info_dict[i] = {
            'energy_intake': energy_intake,
            'kcal': kcal, 
            'fat': fat, 
            'protein': protein, 
            'carbs': carbs,
            'fruit': fruit,
            'raw_vegetables': raw_vegetables,
            'cooked_vegetables': cooked_vegetables,
            'has_legumes':legumes, 
            'has_fish':fish, 
            'has_nuts':nuts, 
            }
        i += 1
    #print(NP_info_dict)
    return NP_info_dict

    





"""
    n = 0
    n1 = 0
    n2 = 0
    n3 = 0
    for s in sum_kcal:
        if s > 3000:
            n += 1 
        if s>=2500 and s<3000:
            n1 += 1
        if s>=2000 and s<2500:
            n2 += 1
        if s<2000:
            n3 += 1    

    print(n)
    print(n1)
    print(n2)
    print(n3)
    """


#-------------------------------------#
    #|                                   |#
    #|                                   |#
    #|    Save statistics to excel       |#
    #|                                   |#
    #|                                   |#
    #-------------------------------------#


    # Create an empty list to store the dictionaries for each row
    #data = []

    # Iterate over the desired number of rows (in this case, 7)
    #for i in range(len(final_meals)):
    #    row_data = {
    #        'Energy Intake': energy_intake,
    #        'Kcal deviation': abs(energy_intake - f_sum_kcal[i]),
    #        'Fat distance': f_fat_distance[i],
    #        'Fruits and Vegetables': f_frandveg_distance[i],
    #        'Dishes diversity': f_dishes_distance[i],
    #    }
    #    data.append(row_data)

    # Create a Pandas dataframe from the dictionary
    #df = pd.DataFrame(data)
    #print(df)

    # Save the dataframe to an Excel file
    # Get the project's base directory
    #base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

        # Construct the file path relative to the project directory
    #file_path = os.path.join(base_dir, 'meal_appropriateness.xlsx')

    # Save the dataframe to the Excel file
    #df.to_excel(file_path, index=False)

    #today = timezone.localdate()
    #start_day = today - timedelta(days=today.weekday())
    #print(start_day)