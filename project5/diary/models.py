from django.contrib.auth.models import AbstractUser
from django.contrib.auth import get_user_model
from django.utils import timezone
from django.db import models


class User(AbstractUser):
    selected_icon = models.CharField(max_length=20, blank=True, null=True)

    def __str__(self):
        return self.username


User = get_user_model()

class Entry(models.Model):
    content = models.TextField()
    created_at = models.DateTimeField(default=timezone.now)
    mood = models.CharField(max_length=20, blank=True, null=True)
    password_required = models.BooleanField(default=False)
    password = models.CharField(max_length=255, blank=True, null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    entry_date = models.DateField(blank=True, null=True)

    def __str__(self):
        return f"Entry by {self.user.username} at {self.created_at} for {self.entry_date}"