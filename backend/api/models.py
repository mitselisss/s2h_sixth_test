from django.db import models
from django.contrib.auth.models import User
from datetime import date

# Create your models here.

class UserProfile(models.Model):

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    gender = models.CharField(max_length=10)
    yob = models.IntegerField(default=1994)
    age = models.IntegerField(null=True)
    height = models.FloatField()
    weight = models.FloatField()
    pal = models.CharField(max_length=50)
    bmi = models.FloatField()
    bmr = models.FloatField()
    energy_intake = models.FloatField()
    halal = models.BooleanField()
    diary = models.BooleanField()
    eggs = models.BooleanField()
    fish = models.BooleanField()
    nuts = models.BooleanField(null=True)
    country = models.CharField(max_length=20, null=True)
    countryLanguageCode = models.CharField(max_length=5, null=True)

    def __str__(self):
        return str(self.user.username)
    
    def age_calculator(self):
        age = date.today().year-self.yob
        return age

    def bmi_calculator(self):
        bmi = self.weight/(self.height*self.height)
        return round(bmi, 2)

    def bmr_calculator(self):
        if self.gender == 'male':
            bmr = 88.362 + (13.397*self.weight) + (4.799*self.height*100) - (5.677*self.age)
        else:
            bmr = 447.593 + (9.247*self.weight) + (3.098*self.height*100) - (4.330*self.age)
        return round(bmr, 2)
 
    def energy_intake_calculator(self):
        #calculate PAL
        if self.pal == 'Sedentary':
            pal = 1.195
        elif self.pal == 'Low active':
            pal = 1.495
        elif self.pal == 'Active':
            pal = 1.745
        elif self.pal == 'Very active':   
            pal = 2.2
        #calculate Energy Intake
        if 18.5<=self.bmi<=24.99:
            energy_intake = self.bmr*pal
        elif self.bmi<18.5:
            energy_intake = self.bmr*pal + 500
        elif self.bmi>24.99:
            energy_intake = self.bmr*pal - 500
            
        return round(energy_intake, 2)
    
    
    def save(self, *args, **kwargs):
        
        self.age = self.age_calculator()
        self.bmi = self.bmi_calculator()
        self.bmr = self.bmr_calculator()
        self.energy_intake = self.energy_intake_calculator()
        
        super().save(*args, **kwargs)  

class UserProfileHistory(models.Model):
    
    #id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    userProfile = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    gender = models.CharField(max_length=10)
    yob = models.IntegerField()
    height = models.FloatField()
    weight = models.FloatField()
    pal = models.CharField(max_length=50)
    halal = models.BooleanField()
    diary = models.BooleanField()
    eggs = models.BooleanField()
    fish = models.BooleanField()
    nuts = models.BooleanField(null=True)
    country = models.CharField(max_length=20)
    countryLanguageCode = models.CharField(max_length=5, null=True)
    updated_at = models.DateTimeField()

    class Meta:
        ordering = ['-updated_at']

    def __str__(self):
        return f"User: {self.user.username} - Updated: {self.updated_at}"
    

class Dish(models.Model):

    id = models.IntegerField(primary_key=True)
    kcal = models.FloatField(null=True)
    fat = models.FloatField(null=True)
    protein = models.FloatField(null=True)
    carbohydrates = models.FloatField(null=True)
    autumn = models.BooleanField(null=True)
    winter = models.BooleanField(null=True)
    spring = models.BooleanField(null=True)
    summer = models.BooleanField(null=True)
    white_meat = models.BooleanField(null=True)
    red_meat = models.BooleanField(null=True)
    pork = models.BooleanField(null=True)
    fish = models.BooleanField(null=True)
    pulses = models.BooleanField(null=True)
    diary = models.BooleanField(null=True)
    eggs = models.BooleanField(null=True)
    pasta = models.BooleanField(null=True)
    rice = models.BooleanField(null=True)
    tubers = models.BooleanField(null=True)
    soups = models.BooleanField(null=True)
    cereals = models.BooleanField(null=True)
    fruit = models.BooleanField(null=True)
    nuts = models.BooleanField(null=True)
    raw_vegetables = models.BooleanField(null=True)
    cooked_vegetables = models.BooleanField(null=True)
    protein_mix = models.BooleanField(null=True)
    unique = models.BooleanField(null=True)
    semi_unique = models.BooleanField(null=True)
    vegetables_semi = models.BooleanField(null=True)
    red = models.BooleanField(null=True)
    green = models.BooleanField(null=True)
    white = models.BooleanField(null=True)
    yellow = models.BooleanField(null=True)
    purple = models.BooleanField(null=True)
    multicolor = models.BooleanField(null=True)
    no_color = models.BooleanField(null=True)

    def __str__(self):
        return str(self.id)
    
class Dish_language(models.Model):

    id = models.IntegerField(primary_key=True)
    dish_id = models.ForeignKey(Dish, on_delete=models.CASCADE)
    language = models.CharField(max_length=5, null=True)
    name = models.CharField(max_length=500, null=True)
    ingredients_adult = models.CharField(max_length=500, null=True)
    recipe = models.CharField(max_length=500, null=True)
    tip = models.CharField(max_length=500, null=True)

    def __str__(self):
        return self.name


class Meal(models.Model):

    id = models.IntegerField(primary_key=True)
    type = models.CharField(max_length=20, null=True)
    country = models.CharField(max_length=20, null=True)
    autumn = models.BooleanField(null=True)
    winter = models.BooleanField(null=True)
    spring = models.BooleanField(null=True)
    summer = models.BooleanField(null=True)
    dish_1 = models.ForeignKey(Dish, on_delete=models.CASCADE, related_name='dish1_menu_set', null=True)
    dish_2 = models.ForeignKey(Dish, on_delete=models.CASCADE, related_name='dish2_menu_set', blank=True, null=True)
    dish_3 = models.ForeignKey(Dish, on_delete=models.CASCADE, related_name='dish3_menu_set', blank=True, null=True)
    dish_4 = models.ForeignKey(Dish, on_delete=models.CASCADE, related_name='dish4_menu_set', blank=True, null=True)
    dish_5 = models.ForeignKey(Dish, on_delete=models.CASCADE, related_name='dish5_menu_set', blank=True, null=True)
    dish_6 = models.ForeignKey(Dish, on_delete=models.CASCADE, related_name='dish6_menu_set', blank=True, null=True)
    dish_7 = models.ForeignKey(Dish, on_delete=models.CASCADE, related_name='dish7_menu_set', blank=True, null=True)
    dish_8 = models.ForeignKey(Dish, on_delete=models.CASCADE, related_name='dish8_menu_set', blank=True, null=True)
    dish_9 = models.ForeignKey(Dish, on_delete=models.CASCADE, related_name='dish9_menu_set', blank=True, null=True)
    dish_10 = models.ForeignKey(Dish, on_delete=models.CASCADE, related_name='dish10_menu_set', blank=True, null=True)

    def __str__(self):
        return str(self.id)

class Meal_language(models.Model):
    
    id = models.IntegerField(primary_key=True)
    meal_id = models.ForeignKey(Meal, on_delete=models.CASCADE)
    language = models.CharField(max_length=5, null=True)
    name = models.CharField(max_length=500, null=True)

    def __str__(self):
        return self.name
    

    
class NP(models.Model):

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    UserProfile = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    start_date = models.DateTimeField(null=True)
    end_date = models.DateTimeField(null=True)
    week = models.IntegerField(null=True)
    day = models.IntegerField()
    meals = models.ManyToManyField(Meal, through='NPmeal')

    def __str__(self):
        return f"User: {self.user.username} -Week: {self.week} - WeekMonday: {self.start_date} - Day: {self.day}"
    
class NPmeal(models.Model):
    
    np = models.ForeignKey(NP, on_delete=models.CASCADE)
    meal = models.ForeignKey(Meal, on_delete=models.CASCADE)
    meal_number = models.IntegerField()

    class Meta:
        ordering = ['meal_number']

    def __str__(self):
        return f"NPhistory: {self.np} - Meal: {self.meal} - Meal Number: {self.meal_number}"