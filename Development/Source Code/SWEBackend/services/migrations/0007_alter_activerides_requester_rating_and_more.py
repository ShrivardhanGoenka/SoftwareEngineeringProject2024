# Generated by Django 5.0.3 on 2024-03-28 15:24

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("services", "0006_remove_activerides_scheduled_service_and_more"),
    ]

    operations = [
        migrations.AlterField(
            model_name="activerides",
            name="requester_rating",
            field=models.FloatField(default=0, null=True),
        ),
        migrations.AlterField(
            model_name="activerides",
            name="responder_rating",
            field=models.FloatField(default=0, null=True),
        ),
    ]
