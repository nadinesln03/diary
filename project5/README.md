# DEAR DIARY... | Capstone CS50W

## Overview
My CS50W final project is the Dear Diary application, providing users a simple and modern online platform to write and manage diary entries. Users can create, edit, and delete entries, assign moods with smileys, and filter content by date and mood. Privacy is ensured, offering a personal and intimate space for self-expression. The application's focus on simplicity and ease of use aims to enable users to capture their experiences and emotions effectively.


## Distinctiveness and Complexity
The Dear Diary project distinguishes itself from other projects in the course by offering a personal and intimate space for self-expression, rather than being an e-commerce platform or a social networking site. It provides users with a modern and straightforward digital diary experience, akin to a personalized blog. The focus on individual experiences, emotions, and thoughts, coupled with features like password protection and mood-based filtering, sets it apart as a unique and private platform.


This project was a personal challenge for me as it involved working with technologies and concepts I had not previously encountered. Before starting this course, I had limited knowledge in web programming, and I started learning JavaScript during the courses lessons, that is why I tried to set the focus on programming with JavaScript to enhance my skills during this project. Throughout the project, I challenged myself to implement complex features, I have not worked with before. One of the notable challenges I faced was creating a mood filter page with custom radio buttons and efficiently fetching corresponding entries. Similar challenges arose in other parts of the project, such as the profile picture selection during registration and mood selection when creating an entry. Implementing the calendar functionality also presented hurdles, as I had to organize and display entries by years, months, and individual diary entries. However, I effectively overcame these obstacles by utilizing Django's date-based queries, specifically TruncMonth and __range, to accurately retrieve and present entries within specific timeframes. Additionally, I introduced a password protection feature to enhance privacy and security, and this required working with modals, handling form submissions, validating passwords, and ensuring secure backend storage. As mobile responsiveness being a requirement for this project, I learned to implement elements such as sidebars and collapsible features.


## Code Overview
I will give a quick overview here about what is in each file I have created or modified

diary
    >diary

        >>models.py
            Defines the models for the diary app. It contains the definitions for the database tables User and Entry
        >>admin.py
            This code registers the User and Entry models with the Django admin interface
        >>urls.py
            This code defines API endpoints for the Dear Diary application, enabling users to interact with various features such as login, registration, creating diary entries, viewing entries by date and mood, and navigating a calendar interface
        >>views.py
            Contains Django views that handle different aspects of the Dear Diary application, including user authentication, diary entry creation, filtering entries, and displaying views for the users. These views connect the application's logic with the database and templates

        >>static
            >>diary
                >>diary.js
                    Is responsible for enhancing the user experience and interactivity on the client-side by handling dynamic content, event handling, and communication with the server through APIs
                >>styles.css
                    Is responsible for defining the visual presentation and layout of the web pages, including fonts, colors, spacing, and overall styling of HTML elements
            >>icons
                Stores all icons and images I have used thoughout my application

        >>templates
            >>diary
                >>layout.html
                    Represents the layout of the Dear Diary application
                >>welcome.html
                    Displays a welcome page for every user who is visiting the page
                >>login.html
                    Provides a login form with fields for username and password to let the user log in
                >>register.html
                    Provides a registration form for new users to create an account. It allows users to enter a username, password, and confirm the password, along with choosing a profile picture
                >>home.html
                    Displays the user's diary entries with a title, entry cards showing entry information, and provides options for viewing, deleting, and entering passwords for private entries
                >>create.html
                    Provides a form for creating a new diary entry with fields for entry date, content, mood selection, and optional password protection
                >>mood.html
                    Allows users to filter diary entries by mood and view the entries accordingly
                >>calendar.html
                    Displays a calendar allowing users to filter their diary entries by year and month, enabling them to view entries posted in specific time periods

    >project5
        >>settings.py:
            A configuration file in Django that defines various settings for the web application, such as database connections, installed apps, and time zones
        >>urls.py:
            Configures URL patterns for the project5 project, specifying how URLs are mapped to views. I added a URL pattern to include the diary app's URLs, which allows access to the views and functionality of the diary app from the main project's URLs.

