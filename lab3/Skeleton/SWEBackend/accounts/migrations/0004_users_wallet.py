# Generated by Django 5.0.2 on 2024-03-01 11:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0003_car_users_address_users_name_users_phone_users_car'),
    ]

    operations = [
        migrations.AddField(
            model_name='users',
            name='wallet',
            field=models.FloatField(default=0),
        ),
    ]
