document.addEventListener('DOMContentLoaded', function() {
    // Selecting DOM elements
    const iconOptions = document.querySelectorAll('.icon-option');
    const selectedIconInput = document.getElementById('selected-icon-input');
    const selectedIconImage = document.getElementById('selected-icon');
    const entryCards = document.querySelectorAll('.entry-card');
    const yearButtons = document.querySelectorAll('.year-button');
    const happySmiley = document.querySelector('.icon-image-happy-filter');
    const neutralSmiley = document.querySelector('.icon-image-neutral-filter');
    const sadSmiley = document.querySelector('.icon-image-sad-filter');
    const backToTopBtn = document.getElementById('backToTopBtn');
    
    const backButtonContainer = document.createElement('div');
    backButtonContainer.id = 'backButtonContainer';
    document.body.appendChild(backButtonContainer);

    // Function to highlight selected icon option
    function highlightSelectedIcon(selectedOption) {
        // Remove 'selected' class and scale down all icon options
        iconOptions.forEach(function(option) {
            option.classList.remove('selected');
            option.querySelector('img').style.transform = 'scale(1)';
        });
    
        // Add 'selected' class and scale up the selected icon option
        selectedOption.classList.add('selected');
        selectedOption.querySelector('img').style.transform = 'scale(1.2)';
    
        // Update the hidden input field with the selected value
        const selectedIconInput = document.getElementById('selected-icon-input');
        selectedIconInput.value = selectedOption.querySelector('input').value;
    }

    // Event listeners for icon options
    for (let i = 0; i < iconOptions.length; i++) {
        iconOptions[i].addEventListener('click', function() {
            const selectedValue = this.querySelector('input[type="radio"]').value;
            selectedIconInput.value = selectedValue;
            if (!this.classList.contains('selected')) {
                highlightSelectedIcon(this);
            }
            console.log('Icon clicked:', selectedValue);
        });
    }

    // Event listener for the 'Create Entry' button
    const createButton = document.getElementById('submit-button');
        if (createButton) {
            createButton.addEventListener('click', function() {
            // Validate the form before submitting
            if (validateForm()) {
                const form = document.querySelector('form');
                form.submit();
            }
        });
    }

    // Event listeners for entry cards
    entryCards.forEach(function(card) {
        card.addEventListener('click', function() {

            const entryId = this.dataset.entryId;
            console.log('Entry ID:', entryId);

            // Check if a password is required for this entry
            const passwordRequiredAttr = this.getAttribute('data-password_required');
            const passwordRequired = passwordRequiredAttr.toLowerCase();
            
            if (passwordRequired === 'true') {
                // Display the password modal for password-protected entries
                const modal = document.getElementById('passwordModal');
                modal.style.display = 'block';

                // Add an event listener for the password form submission
                const form = document.getElementById('password-form');
                form.addEventListener('submit', function(event) {
                    event.preventDefault();
                    const password = document.getElementById('password-input-check').value;

                    // Call the function to check the password for this entry
                    checkPassword(entryId, password);
                });
            } else {
                // View the entry details for non-password-protected entries
                viewEntry(entryId);
            }
        });
    });

    // Function to handle the click event of the 'Save' button for creating or updating an entry
    const saveButton = document.getElementById("save-button");
    if (saveButton) {
        saveButton.addEventListener("click", function() {

        const content = document.getElementById("content-input").value;

        saveEntry(content);
        });
    }

    // Function to attach click event listeners to year buttons for filtering entries by year
    yearButtons.forEach(function(button) {
        // Extract the year from the button text
        const year = button.textContent.split(':')[0].trim();

        button.addEventListener('click', function(event) {
            event.preventDefault();
            // Call the function to fetch and display entries for the selected year
            fetchEntriesByYear(year);
        });
    });
    
    // Function to attach click event listeners to month links for filtering entries by month
    monthLinks.forEach(function(link) {
        // Extract the year and month from the link text and dataset
        const year = link.textContent.split(':')[0].trim();
        const month = link.dataset.month;
        
        // Create a button for the month and set its text and dataset attributes
        const monthButton = document.createElement('button');
        monthButton.classList.add('btn', 'btn-primary', 'month-button');
        monthButton.textContent = `${year} - ${month}`;
        monthButton.dataset.year = year;
        monthButton.dataset.month = month;
        
        // Add a click event listener to the month button for filtering entries by month
        monthButton.addEventListener('click', function() {
            const year = this.dataset.year;
            const month = this.dataset.month;
            fetchEntriesByMonth(year, month);
        });
            monthContainer.appendChild(monthButton);
    });


    // Event listeners for mood icons to filter entries by mood
    happySmiley.addEventListener('click', function() {
        fetchEntriesByMood('happy-smiley');
    });

    neutralSmiley.addEventListener('click', function() {
        fetchEntriesByMood('neutral-smiley');
    });

    sadSmiley.addEventListener('click', function() {
        fetchEntriesByMood('sad-smiley');
    });
    
});

// Function to toggle the display of the sidebar
function toggleSidebar() {
    var sidebar = document.getElementById("sidebar");
    if (sidebar.style.display === "none" || sidebar.style.display === "") {
        sidebar.style.display = "block";
    } else {
        sidebar.style.display = "none";
    }
}

// Function to handle the scroll event for showing/ hiding the back-to-top button
window.onscroll = function() {scrollFunction()};
function scrollFunction() {
    if (document.body.scrollTop > 150 || document.documentElement.scrollTop > 150) {
        backToTopBtn.style.display = 'block';
    } else {
        backToTopBtn.style.display = 'none';
    }
}
  
// Function to scroll to the top of the document
function backToTopFunction() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Function to toggle the display of the password field based on checkbox state
function togglePasswordField(checked) {
    var passwordField = document.getElementById('password-field');
    passwordField.style.display = checked ? 'block' : 'none';
}

// Function to validate the password fields and show validation status
function validatePassword() {
    const passwordInput = document.getElementById('password-input');
    const confirmPasswordInput = document.getElementById('confirm-password-input');
    const passwordStatus = document.getElementById('password-status')

    // Compare the entered passwords and display validation status
    if (passwordInput.value === confirmPasswordInput.value) {
        passwordStatus.textContent = "Passwords match";
        passwordStatus.style.color = "green";
        passwordStatus.classList.remove("password-status-hide");
    } else {
        passwordStatus.textContent = "Passwords do not match";
        passwordStatus.style.color = "red";
        passwordStatus.classList.remove("password-status-hide");
    }
}

// Function to validate the entire entry form before submission
function validateForm() {
    // Get values from input fields
    var entryDate = document.getElementById("entry-date").value;
    var content = document.getElementById("content").value;
    var mood = document.querySelector('input[name="mood"]:checked');
    var passwordRequired = document.querySelector('input[name="password_required"]:checked');

    // Check if required fields are filled
    if (!entryDate ||!content || !mood || !passwordRequired) {
        alert("Please fill out all required fields");
        return false;
    }

    // If password is required, validate the password fields
    if (passwordRequired.value === "true") {
        var password = document.getElementById("password-input").value;
        var confirmPassword = document.getElementById("confirm-password-input").value;

        // Check if password and confirm password match
        if (!password || !confirmPassword) {
            alert("Please enter a password and confirm it");
            return false;
        }

        if (password !== confirmPassword) {
            alert("Paswords do not match");
            return false;
        }
    }

    return true;
}

// Function to check the password for a specific entry with the server
function checkPassword(entryId, password) {
    const csrfToken = getCookie('csrftoken');

    // Send a request to the server to verify the password for the entry
    fetch(`/verify_password/${entryId}/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify({ password: password })
    })
        .then(response => response.json())
        .then(result => {
            // Handle the response from the server
            if (result.success) {
                if (result.match) {
                    viewEntry(entryId); // Password is correct, view the entry
                    closePasswordModal(); // Close the password modal
                } else {
                    alert('Invalid password. Please try again.'); // Password is incorrect, show an error message
                }
            } else {
                console.error('Error checking password:', result.error); // Handle any errors in password verification
            }
        })
        .catch(error => {
            console.error('Error checking password:', error); // Handle errors in fetch or JSON parsing
        });
}


// Function to close the password modal and reset the password input field
function closePasswordModal() {
    passwordModal.style.display = 'none';
    const passwordInput = document.getElementById('password-input-check');
    passwordInput.value = '';
}

// Function to view an entry by fetching it from the server and updating the DOM
function viewEntry(entryId) {
    console.log('Viewing entry:', entryId);

    // Store the previous page URL in localStorage
    const previousPageURL = window.location.href;
    localStorage.setItem('previousPageURL', previousPageURL);

    const csrfToken = getCookie('csrftoken');

    // Fetch the entry from the server
    fetch(`/entry/${entryId}/`, {
        method: 'GET',
        headers: {
            'X-CSRFToken': csrfToken
        }
    })
        .then(response => response.json())
        .then(entry => {

            // Check if the entry is already displayed in the DOM
            const existingEntryView = document.querySelector(`.entry-card-view[data-entry-id="${entry.id}"]`);
            if (existingEntryView) {
                // If the entry is already displayed, update only the content
                const contentElement = existingEntryView.querySelector('.entry-content-view');
                contentElement.innerHTML = entry.content.replace(/\n/g, '<br>');
            } else {
                // If the entry is not displayed, create a new entry view
                const entryView = createEntryView(entry);

                // Check if the entry comes from the home page
                const homeEntry = document.querySelector(`.entry-card[data-entry-id="${entry.id}"]`);
                if (homeEntry) {
                    const title = document.getElementById('title');
                    title.innerHTML = '';
                    const entryContainer = document.getElementById('entryContainer');
                    entryContainer.innerHTML = '';
                    entryContainer.appendChild(entryView);
                }

                // Check if the entry comes from the Mood page
                const moodEntry = document.querySelector(`.entry-card-filter-mood[data-entry-id="${entry.id}"]`);
                if (moodEntry) {
                    const entryContainer = document.getElementById('entryContainerFilter');
                    entryContainer.innerHTML = '';
                    const title = document.getElementById('title');
                    title.innerHTML = '';
                    const moodText = document.getElementById('mood-text');
                    moodText.innerHTML = '';
                    const moodContainer = document.getElementById('container-mood-filter');
                    moodContainer.innerHTML = '';
                    entryContainer.appendChild(entryView);
                }

                // Check if the entry comes from the Calendar page
                const calendarEntry = document.querySelector(`.entry-card-filter-calendar[data-entry-id="${entry.id}"]`);
                if (calendarEntry) {
                    const title = document.getElementById('title');
                    title.innerHTML = '';
                    const calendarContainer = document.getElementById('calendar-container');
                    calendarContainer.innerHTML = '';
                    const calendarText = document.getElementById('calendar-text');
                    calendarText.innerHTML = '';
                    const monthContainer = document.getElementById('monthContainer');
                    monthContainer.innerHTML = '';
                    const entryContainer = document.getElementById('entryContainerFilter');
                    entryContainer.innerHTML = '';
                    entryContainer.appendChild(entryView);
                }
            }
        })
        .catch(error => {
            console.error('Error loading entry:', error);
        });
}


// Function to create a new entry view with the provided entry data
function createEntryView(entry) {
    const entryView = document.createElement('div');
    entryView.classList.add('entry-view-box');

    // Create back button
    const backButton = document.createElement('button');
    backButton.textContent = 'Back';
    backButton.classList.add('btn', 'btn-secondary', 'backButton');
    backButton.addEventListener('click', goBack);
    entryView.appendChild(backButton);
  
    // Create elements for displaying entry details
    const entryCard = document.createElement('div');
    entryCard.classList.add('entry-card-view');
    entryCard.dataset.entryId = entry.id;
  
    const titleElement = document.createElement('p');
    titleElement.classList.add('entry-title-view');
    const entryDate = new Date(entry.entry_date);
    const formattedDate = entryDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    titleElement.textContent = `Entry for: ${formattedDate}`;
    entryCard.appendChild(titleElement);

    const hrElement = document.createElement('hr');
    entryCard.appendChild(hrElement);
  
    const contentElement = document.createElement('p');
    contentElement.classList.add('entry-content-view');
    contentElement.innerHTML = entry.content.replace(/\n/g, '<br>');
    entryCard.appendChild(contentElement);
  
    const entryMeta = document.createElement('div');
    entryMeta.classList.add('entry-meta-view');
  
    const dateElement = document.createElement('span');
    dateElement.classList.add('entry-date-view');
    dateElement.textContent = `Created on ${entry.created_at}`;
    entryMeta.appendChild(dateElement);
  
    const iconElement = document.createElement('img');
    iconElement.classList.add('entry-icon-view');
    iconElement.src = `/static/icons/${entry.mood}.png`;
    iconElement.alt = 'Mood Icon';
    entryMeta.appendChild(iconElement);
  
    entryCard.appendChild(entryMeta);
    entryView.appendChild(entryCard);
  
    // Create Edit and Delete buttons
    const editButton = document.createElement('button');
    editButton.classList.add('btn', 'btn-edit');
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', function() {
        toggleEdit(entryCard, entry.content, entry.id);
    });
    entryView.appendChild(editButton);

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('btn', 'btn-delete');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', function() {
        deleteEntry(entry.id);
    });
    entryView.appendChild(deleteButton);

    return entryView;
}

// Function to navigate back to the previous page
function goBack() {
    const previousPageURL = localStorage.getItem('previousPageURL');
    if (previousPageURL) {
        window.location.href = previousPageURL;
    } else {
        // If the previous page URL is not available, show an alert
        alert("Previous page is not available");
    }
}

// Function to hide the Edit and Delete buttons
function hideEditDeleteButtons() {
    const editButton = document.querySelector('.btn-edit');
    const deleteButton = document.querySelector('.btn-delete');
    if (editButton) {
        editButton.style.display = 'none';
    }
    if (deleteButton) {
        deleteButton.style.display = 'none';
    }
}

// Function to show the Edit and Delete buttons
function showEditDeleteButtons() {
    const editButton = document.querySelector('.btn-edit');
    const deleteButton = document.querySelector('.btn-delete');
    if (editButton) {
        editButton.style.display = 'inline-block'; 
    }
    if (deleteButton) {
        deleteButton.style.display = 'inline-block';
    }
}

// Function to toggle the entry content between view mode and edit mode
function toggleEdit(entryCard, content, entryId) {
    const entryContent = entryCard.querySelector('.entry-content-view');
    entryContent.innerHTML = '';

    const textarea = document.createElement('textarea');
    textarea.classList.add('form-control', 'entry-content-edit');
    textarea.rows = 5;
    textarea.value = content;
    entryContent.appendChild(textarea);

    const saveButton = document.createElement('button');
    saveButton.classList.add('btn', 'btn-primary', 'mr-2', 'saveButton');
    saveButton.textContent = 'Save';
    saveButton.addEventListener('click', function() {
        saveEntry(entryId, textarea.value);
        showEditDeleteButtons(); // Show Edit and Delete button after saving an entry
    });
    entryContent.appendChild(saveButton);

    const cancelButton = document.createElement('button');
    cancelButton.classList.add('btn', 'btn-secondary', 'cancelButton');
    cancelButton.textContent = 'Cancel';
    cancelButton.addEventListener('click', function() {
        cancelEdit(entryCard, content);
        showEditDeleteButtons(); // Show Edit and Delete button after canceling
    });
    entryContent.appendChild(cancelButton);

    hideEditDeleteButtons(); // Hide Edit and Delete Button while Editing
}

// Function to save the edited entry content to the server
function saveEntry(entryId, content) {

    const csrfToken = getCookie("csrftoken");

    // Create a new FormData object to send the entry data in the request body
    const data = new FormData();
    data.append("entry_id", entryId);
    data.append("content", content);

    // Send a POST request to the server to save the entry
    fetch(`/entry/${entryId}/`, {
        method: 'POST',
        headers: {
            "X-CSRFToken": csrfToken
        },
        body: data
    })
    .then(response => {
        console.log("Response status:", response.status);
        if (response.ok) {
            // Parse the response data as JSON and return it
            return response.json();
        } else {
            // If the response status is not okay, throw an error with the status code
            throw new Error("Failed to save entry. Status: " + response.status);
        }
    })
    .then(result => {
        console.log("Entry saved:", result);
        // Check if the server response message indicates successful entry saving
        if (result.message === "Entry saved.") {
            console.log("Entry saved successfully.");

            // Find the entry card in the DOM and update its content with the saved content
            const entryCard = document.querySelector(`.entry-card-view[data-entry-id="${entryId}"]`);
            const entryContent = entryCard.querySelector('.entry-content-view');
            entryContent.innerHTML = content.replace(/\n/g, '<br>');

            // Show the Edit and Delete buttons after saving
            showEditDeleteButtons();
        } else {
            console.log("Failed to save entry.");
        }
    })
    .catch(error => {
        // Handle any errors that occurred during the request or response handling
        console.error("Error saving entry:", error);
    });
}

// Function to cancel the editing of an entry and revert back to view mode
function cancelEdit(entryCard, content) {
    const entryContent = entryCard.querySelector('.entry-content-view');
    entryContent.innerHTML = content.replace(/\n/g, '<br>');
}


// Function to trigger the deletion of an entry and display a confirmation modal
function deleteEntry(entryId) {
    // Show confirmation Modal
    const confirmationModal = document.getElementById('deleteConfirmationModal');
    confirmationModal.style.display = 'block';

    // Event Listener for Confirm Button
    const confirmButton = document.getElementById('confirmDeleteButton');
    confirmButton.addEventListener('click', function() {
        // delete Entry
        deleteEntryById(entryId);
    });

    // Event Listener for the Cancel button
    const cancelButton = document.getElementById('cancelDeleteButton');
    cancelButton.addEventListener('click', function() {
        // Close Modal
        confirmationModal.style.display = 'none';
    });
}


// Function to delete an entry by sending a request to the server
function deleteEntryById(entryId) {
    const csrfToken = getCookie('csrftoken');

    // Send a DELETE request to the server to delete the entry
    fetch(`/entry/${entryId}/`, {
        method: 'DELETE',
        headers: {
            'X-CSRFToken': csrfToken
        }
    })
    .then(response => {
        if (response.ok) {
            // Parse the response data as JSON and return it
            return response.json();
        } else {
            // If the response status is not okay, throw an error with the status code
            throw new Error('Failed to delete entry. Status: ' + response.status);
        }
    })
    .then(responseData => {
        console.log('Entry deleted:', responseData);
        // Find and remove the entry card from the DOM if it exists
        const entryCard = document.querySelector(`.entry-card-view[data-entry-id="${entryId}"]`);
        if (entryCard) {
            entryCard.remove();
        }
        // Close the confirmation modal after successful deletion
        const confirmationModal = document.getElementById('deleteConfirmationModal');
        confirmationModal.style.display = 'none';
        
        // Redirect to the home page after deletion
        window.location.href = '/home';
    })
    .catch(error => {
        // Handle any errors that occurred during the request or response handling
        console.error('Error deleting entry:', error);
    });
}


// Function to fetch months for a specific year from the server
function fetchEntriesByYear(year) {

    // Get the container to display the fetched months and clear its contents
    const entryContainer = document.getElementById('entryContainerFilter');
    entryContainer.innerHTML = '';

    // Send a GET request to the server to fetch the months data for the specified year
    fetch(`/calendar/${year}/fetch/`)
        .then(function(response) {
            if (response.ok) {
                // Parse the response data as JSON and return it
                return response.json();
            } else {
                // If the response status is not okay, throw an error with the status code
                throw new Error('Error: ' + response.status);
            }
        })
        .then(function(data) {
            // Call the function to display the fetched months on the UI
            displayMonths(year, data.calendar_entries);
        })
        .catch(function(error) {
            // Handle any errors that occurred during the request or response handling
            console.error('Error fetching months by year:', error);
        });
}


// Function to display the fetched months on the UI
function displayMonths(year, months) {

    const monthContainer = document.getElementById('monthContainer');
    monthContainer.innerHTML = '';

    if (months && months.length > 0) {
        // Loop through each month and create a button for it
        months.forEach(monthData => {
            const monthButton = document.createElement('button');
            monthButton.classList.add('btn', 'btn-light', 'month-button');
            monthButton.textContent = monthData;
            monthButton.dataset.year = year;
            monthButton.dataset.month = monthData;

            // Add an event listener to the button to fetch entries for the selected month
            monthButton.addEventListener('click', function() {
                const year = this.dataset.year;
                const month = this.dataset.month;
                fetchEntriesByMonth(year, month);
            });
            monthContainer.appendChild(monthButton);
        });
    } else {
        // If no months are available, display a message
        const message = document.createElement('p');
        message.textContent = 'No entries available';
        monthContainer.appendChild(message);
    }
}


// Function to fetch entries for a specific month in a year from the server
function fetchEntriesByMonth(year, monthData) {

    // Send a GET request to the server to fetch the entries data for the specified month in the year
    fetch(`/calendar/${year}/${monthData}/fetch/`)
        .then(function(response) {
            if (response.ok) {
                // Parse the response data as JSON and return it
                return response.json();
            } else {
                // If the response status is not okay, throw an error with the status code
                throw new Error('Error: ' + response.status);
            }
        })
        .then(function(data) {
            // Call the function to display the fetched entries on the UI
            displayEntries(year, monthData, data.calendar_entries);
        })
        .catch(function(error) {
            // Handle any errors that occurred during the request or response handling
            console.error('Error fetching entries by month:', error);
        });
}


// Function to display the fetched entries on the UI
function displayEntries(year, month, entries) {

    const entryContainer = document.getElementById('entryContainerFilter');
    entryContainer.innerHTML = '';

    if (entries && entries.length > 0) {
        // Loop through each entry and create an entry card for it
        entries.forEach(entry => {
            createEntryCardCalendar(entry);
        });
    } else {
        // If no entries are available, display a message
        const message = document.createElement('p');
        message.textContent = 'No entries available.';
        entryContainer.appendChild(message);
    }
}


// Function to create an entry card for a calendar view
function createEntryCardCalendar(entry) {
    // Get the container to display the entry cards
    const cardContainer = document.getElementById('entryContainerFilter');

    // Create a new entry card
    const card = document.createElement('div');
    card.classList.add('entry-card-filter-calendar');
    card.dataset.entryId = entry.id;

    const title = document.createElement('p');
    title.classList.add('entry-title');
    const entryDate = new Date(entry.entry_date);
    const formattedDate = entryDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    title.textContent = `Entry for: ${formattedDate}`;
    card.appendChild(title);

    const hr = document.createElement('hr');
    card.appendChild(hr);

    if (entry.password_required) {
        const content = document.createElement('p');
        content.classList.add('entry-content-private');
        content.textContent = 'This content is not viewable';
        card.appendChild(content);
    } else {
        const content = document.createElement('p');
        content.classList.add('entry-content');
        content.textContent = entry.content.slice(0, 45) + ' ...';
        card.appendChild(content);
    }

    const meta = document.createElement('div');
    meta.classList.add('entry-meta');

    const createdDateBottom = new Date(entry.created_at);
    const formattedDateBottom = createdDateBottom.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    });
    const date = document.createElement('span');
    date.classList.add('entry-date');
    date.textContent = `Created on: ${formattedDateBottom}`;
    meta.appendChild(date);

    const icon = document.createElement('img');
    icon.classList.add('entry-icon');
    icon.src = `/static/icons/${entry.mood}.png`;
    icon.alt = 'Mood Icon';
    meta.appendChild(icon);

    card.appendChild(meta);

    // Add the entry card to the container
    cardContainer.appendChild(card);

    // Add an event listener to the card to view the entry details when clicked
    card.addEventListener('click', function() {

        const entryId = this.dataset.entryId;

        // Check if the entry requires a password, if yes, display a password modal   
        if (entry.password_required) {

            const modal = document.getElementById('passwordModal');
            modal.style.display = 'block';

            // Add an event listener to the password form to handle password submission
            const form = document.getElementById('password-form');
            form.addEventListener('submit', function(event) {
                event.preventDefault();
                const password = document.getElementById('password-input-check').value;

                // Call the function to check the password for the entry
                checkPassword(entryId, password);
            });
        } else {
            // If no password is required, directly view the entry details
            viewEntry(entryId);
        }
    });

    return cardContainer;
}


// Function to fetch entries by mood from the server
function fetchEntriesByMood(mood) {

    const csrfToken = getCookie('csrftoken');

    // Set the selected mood in the input field
    const selectedIconInput = document.getElementById("selected-icon-input");
    selectedIconInput.value = mood;

    // Fetch entries by mood from the server
    fetch(`/mood/${mood}/fetch/`, {
        method: 'GET',
        headers: {
            'X-CSRFToken': csrfToken
        }
    })
        .then(response => response.json())
        .then(data => {
            console.log("Entries fetched:", data.entry_data);

            // Process and display the received entries
            const entryContainer = document.getElementById("entryContainerFilter");
            entryContainer.innerHTML = "";

            if (data.entry_data.length === 0) {
                // If no entries are available, display message
                const messageContainer = document.createElement('div');
                messageContainer.classList.add('message-container');
            
                const message = document.createElement('p');
                message.classList.add('home-text');
                message.textContent = "You haven't created any Diary Entries yet with this Mood";
            
                messageContainer.appendChild(message);
                entryContainer.appendChild(messageContainer);
            }
             else {
                // If entries are available, display them
                data.entry_data.forEach(entry => {
                    const entryCard = createEntryCardMood(entry);
                });
            }
        })
        .catch(error => console.log(error));
}


// Function to create an entry card based on the mood
function createEntryCardMood(entry) {
    // Get the container to display the entry cards
    const cardContainer = document.getElementById('entryContainerFilter');

    // Create a new entry card
    const card = document.createElement('div');
    card.classList.add('entry-card-filter-mood');
    card.dataset.entryId = entry.id;

    const title = document.createElement('p');
    title.classList.add('entry-title');
    const entryDate = new Date(entry.entry_date);
    const formattedDate = entryDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    title.textContent = `Entry for: ${formattedDate}`;
    card.appendChild(title);

    const hr = document.createElement('hr');
    card.appendChild(hr);

    if (entry.password_required) {
        const content = document.createElement('p');
        content.classList.add('entry-content-private');
        content.textContent = 'This content is not viewable';
        card.appendChild(content);
    } else {
        const content = document.createElement('p');
        content.classList.add('entry-content');
        content.textContent = entry.content.slice(0, 45) + ' ...';
        card.appendChild(content);
    }

    const meta = document.createElement('div');
    meta.classList.add('entry-meta');

    const createdDateBottom = new Date(entry.created_at);
    const formattedDateBottom = createdDateBottom.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    });
    const date = document.createElement('span');
    date.classList.add('entry-date');
    date.textContent = `Created on: ${formattedDateBottom}`;
    meta.appendChild(date);

    const icon = document.createElement('img');
    icon.classList.add('entry-icon');
    icon.src = `/static/icons/${entry.mood}.png`;
    icon.alt = 'Mood Icon';
    meta.appendChild(icon);

    card.appendChild(meta);

    // Add the entry card to the container
    cardContainer.appendChild(card);

    // Add an event listener to the card to view the entry details when clicked
    card.addEventListener('click', function() {

        const entryId = this.dataset.entryId;
       
        // Check if the entry requires a password, if yes, display a password modal   
        if (entry.password_required) {

            const modal = document.getElementById('passwordModal');
            modal.style.display = 'block';

            // Add an event listener to the password form to handle password submission
            const form = document.getElementById('password-form');
            form.addEventListener('submit', function(event) {
                event.preventDefault();
                const password = document.getElementById('password-input-check').value;

                // Call the function to check the password for the entry
                checkPassword(entryId, password);
            });
        } else {
            // If no password is required, directly view the entry details
            viewEntry(entryId);
        }
    });

    return cardContainer;
}

// Function to get the value of a cookie by name
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}