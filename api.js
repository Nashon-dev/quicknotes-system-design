const API_URL = "https://jsonplaceholder.typicode.com/posts";

const loadButton = document.querySelector("#load-btn");
const statusMessage = document.querySelector("#status");
const notesList = document.querySelector("#notes-list");
const noteForm = document.querySelector("#note-form");
const titleInput = document.querySelector("#title-input");
const bodyInput = document.querySelector("#body-input");
const submitButton = document.querySelector("#submit-btn");

// Reusable function for making API requests
async function request(url, options = {}) {
    const response = await fetch(url, options);

    if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
    }

    const data = response.status === 204
        ? null
        : await response.json();

    return { data, status: response.status };
}

// Display notes on the page
function displayNotes(notes) {
    notesList.replaceChildren();

    if (notes.length === 0) {
        const message = document.createElement("li");
        message.textContent = "No notes found.";
        notesList.appendChild(message);
        return;
    }

    notes.forEach(note => {
        const item = document.createElement("li");

        const title = document.createElement("h3");
        title.textContent = note.title;

        const body = document.createElement("p");
        body.textContent = note.body;

        item.appendChild(title);
        item.appendChild(body);
        notesList.appendChild(item);
    });
}

// Load the first 10 notes from the API
async function loadNotes() {
    loadButton.disabled = true;
    statusMessage.className = "";
    statusMessage.textContent = "Loading notes...";

    try {
        const { data: notes } = await request(`${API_URL}?_limit=10`);

        displayNotes(notes);

        statusMessage.className = "success";
        statusMessage.textContent = notes.length
            ? `Loaded ${notes.length} notes from the server.`
            : "No notes were returned.";
    } catch (error) {
        statusMessage.className = "error";
        statusMessage.textContent =
            "Unable to load notes. Please check your connection and try again.";

        console.error("Error loading notes:", error);
    } finally {
        loadButton.disabled = false;
    }
}

// Create a note using POST
async function createNote(event) {
    event.preventDefault();

    const title = titleInput.value.trim();
    const body = bodyInput.value.trim();

    if (!title) {
        statusMessage.className = "error";
        statusMessage.textContent = "Please enter a note title.";
        titleInput.focus();
        return;
    }

    if (title.length > 100) {
        statusMessage.className = "error";
        statusMessage.textContent =
            "The title must be 100 characters or fewer.";
        titleInput.focus();
        return;
    }

    submitButton.disabled = true;
    statusMessage.className = "";
    statusMessage.textContent = "Creating note...";

    try {
        const { data: newNote, status } = await request(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title,
                body,
                userId: 1
            })
        });

        // JSONPlaceholder simulates creating data; it does not save it permanently.
        const item = document.createElement("li");

        const heading = document.createElement("h3");
        heading.textContent = newNote.title;

        const paragraph = document.createElement("p");
        paragraph.textContent = newNote.body;

        item.appendChild(heading);
        item.appendChild(paragraph);
        notesList.prepend(item);

        statusMessage.className = "success";
        statusMessage.textContent =
            `Note created successfully (HTTP ${status}).`;

        noteForm.reset();
    } catch (error) {
        statusMessage.className = "error";
        statusMessage.textContent =
            "Unable to create the note. Please try again.";

        console.error("Error creating note:", error);
    } finally {
        submitButton.disabled = false;
    }
}

loadButton.addEventListener("click", loadNotes);
noteForm.addEventListener("submit", createNote);
