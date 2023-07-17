# Generated by Django 4.1.3 on 2023-07-15 12:12

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('diary', '0007_remove_entry_created_at'),
    ]

    operations = [
        migrations.AddField(
            model_name='entry',
            name='created_at',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
        migrations.AddField(
            model_name='entry',
            name='entry_date',
            field=models.DateField(blank=True, null=True),
        ),
    ]