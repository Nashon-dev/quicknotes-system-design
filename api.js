const API_URL = "https://jsonplaceholder.typicode.com/posts";

const loadButton = document.querySelector("#load-btn");
const statusMessage = document.querySelector("#status");
const notesList = document.querySelector("#notes-list");

// Reusable function for making API requests
async function request(url) {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
    }

    return response.json();
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
    statusMessage.textContent = "Loading notes...";

    try {
        const notes = await request(`${API_URL}?_limit=10`);

        displayNotes(notes);

        if (notes.length === 0) {
            statusMessage.textContent = "No notes were returned.";
        } else {
            statusMessage.textContent =
                `Loaded ${notes.length} notes from the server.`;
        }
    } catch (error) {
        statusMessage.textContent =
            "Unable to load notes. Please check your connection and try again.";

        console.error("Error loading notes:", error);
    } finally {
        loadButton.disabled = false;
    }
}

loadButton.addEventListener("click", loadNotes);
