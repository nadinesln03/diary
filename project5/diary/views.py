from django.db.models.functions import TruncMonth, TruncYear
from django.utils import timezone
from datetime import datetime
import calendar
import json

from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.db.models import Count
from django.http import JsonResponse, HttpResponseNotAllowed
from django.shortcuts import render, redirect, get_object_or_404

from .models import User, Entry


def welcome(request):
    # Renders the welcome page and shows the current date if the user is not authenticated
    # If the user is authenticated, redirects them to the home page
    current_date = datetime.now().strftime("%B %dth, %Y")

    if request.user.is_authenticated:
        return home(request)
    
    else:

        return render(request, "diary/welcome.html", {
            "current_date": current_date
    })


def register(request):
    # Handles user registration
    # If the request method is POST, it processes the registration form data, creates a new user, and logs them in
    # If the registration is successful, it redirects to the home page
    # If the username is already taken, it displays an error message
    if request.method == "POST":
        # Get user registration data from the POST request
        username = request.POST.get("username")
        password = request.POST.get("password")
        confirmation = request.POST.get("confirmation")
        selected_icon = request.POST.get("selected_icon")

        # Check if the passwords match
        if password != confirmation:
            return render(request, "diary/register.html", {
                "message": "Passwords must match."
            })

        try:
            # Create a new user with the provided username and password
            user = User.objects.create_user(username=username, password=password)
            user.selected_icon = selected_icon

            user.save()

        except IntegrityError:
            # If the username is already taken, display an error message
            return render(request, "diary/register.html", {
                "message": "Username already taken."
            })

        # Log in the user and redirect to the home page
        login(request, user)
        return redirect("home")
    else:
        # If the request method is not POST, display the registration form
        return render(request, "diary/register.html")


def login_view(request):
    # Handles user login
    # If the request method is POST, it authenticates the user using the provided username and password
    # If the user is authenticated, it logs them in and redirects to the home page
    # If the login is unsuccessful, it displays an error message
    if request.method == "POST":
        # Get login data from the POST request
        username = request.POST.get("username")
        password = request.POST.get("password")

        # Authenticate the user using the provided username and password
        user = authenticate(request, username=username, password=password)

        if user is not None:
            # If the user is authenticated, log them in and redirect to the home page
            login(request, user)
            return redirect("home")
        else:
            # If the login is unsuccessful, display an error message
            return render(request, "diary/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        # If the request method is not POST, display the login form
        return render(request, "diary/login.html")


@login_required
def logout_view(request):
    # Logs out the authenticated user and redirects to the login page
    logout(request)
    return redirect("login")
    


@login_required
def home(request):
    # Displays the home page for the authenticated user
    # Shows the username, a list of entries ordered by entry date (most recent first), and the current date
    username = request.user.username
    entries = Entry.objects.filter(user=request.user).order_by("-entry_date")
    current_date = datetime.now().strftime("%Y-%m-%d")

    return render(request, "diary/home.html", {
        "username": username,
        "entries": entries,
        "current_date": current_date
    })


def create_entry(request):
    # Handles the creation of a new diary entry
    # If the request method is POST, it processes the form data, creates a new entry, and saves it to the database
    # If the request method is not POST, it displays the entry creation form
    if request.method == "POST":
        # Get entry data from the POST request
        content = request.POST.get("content")
        mood = request.POST.get("mood")
        password_required = request.POST.get("password_required") == "true"
        password = request.POST.get("password")
        entry_date = request.POST.get("entry_date")

        # Create a new entry object with the provided data
        entry = Entry(
            content=content,
            mood=mood,
            password_required=password_required,
            password=password,
            entry_date=entry_date,
            user=request.user
        )
        entry.save()

        # Redirect to the home page after saving the entry
        return redirect("home")
    else:
        # If the request method is not POST, display the entry creation form with the current date set as the default date
        current_date = datetime.now().strftime("%Y-%m-%d")
        entry_date = datetime.now().strftime("%B %dth, %Y")
        return render(request, "diary/create.html", {
            "entry_date": entry_date,
            "current_date": current_date
        })
    

@login_required
def verify_password(request, entry_id):
    # Verifies the password for an entry
    # If the request method is POST, it compares the provided password with the actual password for the entry
    # Returns a JSON response indicating whether the passwords match or not
    if request.method == "POST":
        # Get the password data from the request body
        data = json.loads(request.body)
        password = data.get("password")

        # Get the entry object with the provided entry_id for the authenticated user
        entry = get_object_or_404(Entry, pk=entry_id, user=request.user)

        print(entry.password)
        print(password)

        # Compare the provided password with the actual password for the entry
        if entry.password == password:
            return JsonResponse({"success": True, "match": True})
        else:
            return JsonResponse({"success": True, "match": False})

    # If the request method is not POST, return an error response
    return JsonResponse({"error": "Invalid request method."}, status=405)


@login_required
def entry_view(request, entry_id):
    # Handles the view and update of a specific entry
    # If the request method is POST, it saves the updated content of the entry to the database
    # If the request method is GET, it returns a JSON response containing the entry data
    # If the request method is DELETE, it deletes the entry from the database
    if request.method == "POST":
        # Save the updated content of the entry
        entry = get_object_or_404(Entry, pk=entry_id, user=request.user)
        content = request.POST.get("content")

        entry.content = content
        entry.save()

        entry_data = {
            "message": "Entry saved.",
        }
        return JsonResponse(entry_data)
    
    if request.method == "GET":
        # Get the entry data and return a JSON response with the entry details
        entry = get_object_or_404(Entry, pk=entry_id, user=request.user)
        entry_data = {
            "id": entry.pk,
            "content": entry.content,
            "entry_date": entry.entry_date,
            "created_at": entry.created_at.strftime("%B %d, %Y %I:%M %p"),
            "mood": entry.mood,
            "password_required": entry.password_required,
            "password": entry.password,
            "user": entry.user.username
        }
        return JsonResponse(entry_data)
    
    elif request.method == "DELETE":
        # Delete the entry from the database and return a JSON response with a success message
        entry = get_object_or_404(Entry, pk=entry_id, user=request.user)
        entry.delete()
        return JsonResponse({"message": "Entry deleted."})

    # If the request method is not POST, GET or DELETE, return an error response
    return HttpResponseNotAllowed(["POST", "GET", "DELETE"])


@login_required
def calendar_view(request):
    # Displays the calendar view for the authenticated user
    # It shows the count of entries for each year, allowing users to filter entries by year
    calendar_entries = (
        Entry.objects.filter(user=request.user)
        .annotate(year=TruncYear("entry_date"))
        .values("year")
        .annotate(year_entry_count=Count("id"))
    )

    years = [(entry["year"].year, entry["year_entry_count"]) for entry in calendar_entries]

    return render(request, "diary/calendar.html", {"years": years})

@login_required
def fetch_entries_by_year(request, year):
    # Fetches and returns entries for a specific year in a JSON response
    if request.method == "GET":
        try:
            year = int(year)
        except ValueError:
            return JsonResponse({"error": "Invalid year."}, status=400)

        # Get the start and end dates for the specified year
        start_date = timezone.datetime(year, 1, 1).date()
        end_date = timezone.datetime(year + 1, 1, 1).date()

        # Retrieve the entries for the specified year and annotate the count of entries for each month
        calendar_entries = (
            Entry.objects.filter(user=request.user, entry_date__range=(start_date, end_date))
            .annotate(month=TruncMonth("entry_date"))
            .values("month")
            .annotate(month_entry_count=Count("id"))
        )

        # Format the month names and return the calendar_entries in a JSON response
        calendar_entries = [(entry["month"].strftime("%B")) for entry in calendar_entries]

        return JsonResponse({"calendar_entries": calendar_entries})
    else:
        return JsonResponse({"error": "Invalid request method."}, status=405)
    

@login_required
def fetch_entries_by_month(request, year, month):
    # Fetches and returns entries for a specific month in a JSON response
    if request.method == "GET":
        try:
            # Convert the month name to the corresponding month number using calendar.month_name list
            month_number = list(calendar.month_name).index(month)
            # Query the database to get all entries for the specified year and month
            entries = Entry.objects.filter(user=request.user, entry_date__year=year, entry_date__month=month_number)
            
            # Prepare calendar_entries for the JSON response
            calendar_entries = [{
                "id": entry.id,
                "content": entry.content,
                "created_at": entry.created_at.strftime("%Y-%m-%d %H:%M:%S"),
                "entry_date": entry.entry_date,
                "mood": entry.mood,
                "password_required": entry.password_required,
                "password": entry.password,
                "user": entry.user.username
            } for entry in entries]

            return JsonResponse({"calendar_entries": calendar_entries})
        except ValueError:
            return JsonResponse({"error": "Invalid month value"})


@login_required
def mood_view(request):
    # Displays the mood filter view for the authenticated user
    # If the request method is GET, it renders the mood filter page
    # If the request method is POST, it filters entries based on the selected mood and returns the filtered entries
    if request.method == "GET":
        return render(request, "diary/mood.html")
    elif request.method == "POST":
        mood = request.POST.get("mood")

        # Filter entries by mood and order them by entry date (most recent first)
        entries = Entry.objects.filter(user=request.user, mood=mood).order_by("-entry_date")

        return render(request, "diary/mood.html", {"entries": entries})


@login_required
def fetch_entries_by_mood(request, mood):
    # Fetches and returns entries filtered by mood in a JSON response
    if request.method == "GET":
        # Filter entries by mood and order them by entry date (most recent first)
        entries = Entry.objects.filter(user=request.user, mood=mood).order_by("-entry_date")

        # Prepare the entry data for the JSON response
        entry_data = [{
            "id": entry.id,
            "content": entry.content[:45],
            "created_at": entry.created_at.strftime("%B %d, %Y"),
            "entry_date": entry.entry_date,
            "mood": entry.mood,
            "password_required": entry.password_required,
            "password": entry.password,
            "user": entry.user.username
        } for entry in entries]

        print(entries)

        return JsonResponse({"entry_data": entry_data})
    else:
        return HttpResponseNotAllowed(["GET"])