# Generated by Django 5.0.3 on 2024-03-28 14:39

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("accounts", "0017_remove_authtokens_date"),
        ("services", "0005_wallethistory"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="activerides",
            name="scheduled_service",
        ),
        migrations.RemoveField(
            model_name="activerides",
            name="time_requested",
        ),
        migrations.RemoveField(
            model_name="currentrequest",
            name="scheduled_service",
        ),
        migrations.RemoveField(
            model_name="currentrequest",
            name="time_requested",
        ),
        migrations.RemoveField(
            model_name="servicehistory",
            name="scheduled_service",
        ),
        migrations.RemoveField(
            model_name="servicehistory",
            name="time_requested",
        ),
        migrations.CreateModel(
            name="RequesterRating",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("rating", models.FloatField(default=0)),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="accounts.users"
                    ),
                ),
            ],
            options={
                "abstract": False,
            },
        ),
        migrations.CreateModel(
            name="ResponderRating",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("rating", models.FloatField(default=0)),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="accounts.users"
                    ),
                ),
            ],
            options={
                "abstract": False,
            },
        ),
    ]
