from django.urls import path
from django.urls import reverse

from . import views

urlpatterns = [
    path("", views.welcome, name="welcome"),

    path("login/", views.login_view, name="login"),
    path("logout/", views.logout_view, name="logout"),
    path("register/", views.register, name="register"),
    path("home/", views.home, name="home"),
    path("create/", views.create_entry, name="create_entry"),

    path("entry/<int:entry_id>/", views.entry_view, name="entry_view"),
    path("verify_password/<int:entry_id>/", views.verify_password, name="verify_password"),
    
    path("calendar/<int:year>/<str:month>/fetch/", views.fetch_entries_by_month, name="fetch_entries_by_month"),
    path("calendar/<int:year>/fetch/", views.fetch_entries_by_year, name="fetch_entries_by_year"),
    path("calendar/", views.calendar_view, name="calendar"),

    path("mood/<str:mood>/fetch/", views.fetch_entries_by_mood, name="fetch_entries_by_mood"),
    path("mood/", views.mood_view, name="mood_view")
]