# DEAR DIARY... | Capstone CS50W

## Overview
My CS50W final project is the Dear Diary application, providing users a simple and modern online platform to write and manage diary entries. Users can create, edit, and delete entries, assign moods with smileys, and filter content by date and mood. Privacy is ensured, offering a personal and intimate space for self-expression. The application's focus on simplicity and ease of use aims to enable users to capture their experiences and emotions effectively.


## Distinctiveness and Complexity
The Dear Diary project distinguishes itself from other projects in the course by offering a personal and intimate space for self-expression, rather than being an e-commerce platform or a social networking site. It provides users with a modern and straightforward digital diary experience, akin to a personalized blog. The focus on individual experiences, emotions, and thoughts, coupled with features like password protection and mood-based filtering, sets it apart as a unique and private platform.


This project was a personal challenge for me as it involved working with technologies and concepts I had not previously encountered. Before starting this course, I had limited knowledge in web programming, and I started learning JavaScript during the courses lessons, that is why I tried to set the focus on programming with JavaScript to enhance my skills during this project. Throughout the project, I challenged myself to implement complex features, I have not worked with before. One of the notable challenges I faced was creating a mood filter page with custom radio buttons and efficiently fetching corresponding entries. Similar challenges arose in other parts of the project, such as the profile picture selection during registration and mood selection when creating an entry. Implementing the calendar functionality also presented hurdles, as I had to organize and display entries by years, months, and individual diary entries. However, I effectively overcame these obstacles by utilizing Django's date-based queries, specifically TruncMonth and __range, to accurately retrieve and present entries within specific timeframes. Additionally, I introduced a password protection feature to enhance privacy and security, and this required working with modals, handling form submissions, validating passwords, and ensuring secure backend storage. As mobile responsiveness being a requirement for this project, I learned to implement elements such as sidebars and collapsible features.


## Code Overview
I will give a quick overview here about what is in each file I have created or modified

- diary/diary/models.py:
    - Defines the models for the diary app, including User and Entry, representing database tables for user accounts and diary entries

- diary/diary/admin.py:
    - Registers the User and Entry models with the Django admin interface, allowing admin users to manage user accounts and diary entries

- diary/diary/urls.py:
    - Defines API endpoints for the Dear Diary application, enabling users to interact with various features, such as login, registration, creating diary entries, viewing entries by date and mood, and navigating a calendar interface

- diary/diary/views.py:
    - Contains Django views that handle different aspects of the Dear Diary application, including user authentication, diary entry creation, filtering entries, and displaying views for the users. These views connect the application's logic with the database and templates

- diary/static/diary/diary.js:
    - Responsible for enhancing the user experience and interactivity on the client-side by handling dynamic content, event handling, and communication with the server through APIs

- diary/static/diary/styles.css:
    - Defines the visual presentation and layout of the web pages, including fonts, colors, spacing, and overall styling of HTML elements

- diary/static/icons/:
    - Stores all icons and images used throughout the application

- diary/templates/diary/layout.html:
    - Represents the layout template for the "Dear Diary" application, providing a common structure for all pages

- diary/templates/diary/welcome.html:
    - Displays a welcome page for every user who visits the application

- diary/templates/diary/login.html:
    - Provides a login form with fields for username and password to allow users to log in

- diary/templates/diary/register.html:
    - Provides a registration form for new users to create an account, allowing them to enter a username, password, and confirm the password, along with choosing a profile picture

- diary/templates/diary/home.html:
    - Displays the user's diary entries with a title, entry cards showing entry information, and provides options for viewing, deleting, and entering passwords for private entries

- diary/templates/diary/create.html:
    - Provides a form for creating a new diary entry with fields for entry date, content, mood selection, and optional password protection

- diary/templates/diary/mood.html:
    - Allows users to filter diary entries by mood and view the entries accordingly

- diary/templates/diary/calendar.html:
    - Displays a calendar, enabling users to filter their diary entries by year and month, and view entries posted in specific time periods

- project5/settings.py:
    - A configuration file in Django that defines various settings for the web application, such as database connections, installed apps, and time zones

- project5/urls.py:
    - Configures URL patterns for the "Dear Diary" project, specifying how URLs are mapped to views. It includes the diary app's URLs, allowing access to its views and functionality from the main project's URLs


