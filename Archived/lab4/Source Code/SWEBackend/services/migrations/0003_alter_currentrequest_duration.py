# Generated by Django 5.0.3 on 2024-03-28 06:41

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("services", "0002_alter_currentrequest_duration"),
    ]

    operations = [
        migrations.AlterField(
            model_name="currentrequest",
            name="duration",
            field=models.FloatField(max_length=255),
        ),
    ]
