# Generated by Django 5.0.3 on 2024-03-23 19:14

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("accounts", "0004_users_wallet"),
    ]

    operations = [
        migrations.AddField(
            model_name="authtokens",
            name="date",
            field=models.DateTimeField(
                auto_now_add=True, default=django.utils.timezone.now
            ),
            preserve_default=False,
        ),
    ]