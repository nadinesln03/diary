# Generated by Django 4.1.3 on 2023-07-15 11:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('diary', '0004_user_selected_icon'),
    ]

    operations = [
        migrations.AlterField(
            model_name='entry',
            name='created_at',
            field=models.DateTimeField(),
        ),
    ]
