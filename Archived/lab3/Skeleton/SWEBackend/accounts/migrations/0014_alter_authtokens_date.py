# Generated by Django 5.0.3 on 2024-03-24 15:52

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("accounts", "0013_alter_authtokens_date"),
    ]

    operations = [
        migrations.AlterField(
            model_name="authtokens",
            name="date",
            field=models.DateTimeField(auto_now_add=True),
        ),
    ]
