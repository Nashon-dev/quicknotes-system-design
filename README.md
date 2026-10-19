
# QuickNotes System Design

A browser-based notes client and system-design capstone project demonstrating REST API operations, relational database design, and scalable web architecture.

## Project Overview

QuickNotes allows users to load notes from an API, create notes, and delete notes. The project also documents how a production notes service could manage users, notes, and tags while supporting scalability, security, and reliability.

**Technologies used**
- HTML5
- CSS3
- JavaScript (Fetch API, async/await)
- JSONPlaceholder for simulated API operations
- SQL / SQLite-compatible schema design
- Git and GitHub

## Features

- Load notes using an HTTP GET request.
- Create notes using an HTTP POST request.
- Delete notes using an HTTP DELETE request.
- Display loading, success, and error messages.
- Validate required note titles and limit titles to 100 characters.
- Display notes safely using DOM methods and `textContent`.
- Document REST endpoints, database relationships, and production architecture.

**Important:** JSONPlaceholder simulates create and delete operations. Changes made through this demo client are not permanently saved by the remote service.

## Project Structure

```text
quicknotes-system-design/
├── index.html
├── style.css
├── api.js
├── README.md
└── docs/
    ├── api-design.md
    ├── data-model.md
    └── architecture.md
```

## How to Run the Client

1. Clone or download this repository.
2. Open the project folder in Visual Studio Code.
3. Open `index.html` with the Live Server extension, or serve the folder using another local web server.
4. Click **Load notes** to retrieve sample notes.
5. Use the form to create a note or the Delete button to remove a displayed note.

An internet connection is required to access JSONPlaceholder.

The browser client uses:

`https://jsonplaceholder.typicode.com/posts`

The production API described in the documentation is a proposed design and is not implemented by JSONPlaceholder.

## Documentation

- [REST API Design](docs/api-design.md) — endpoints, JSON examples, validation, and errors.
- [Database Design](docs/data-model.md) — tables, keys, relationships, SQL schema, queries, and indexes.
- [System Architecture](docs/architecture.md) — requirements, capacity estimates, architecture diagram, request flows, and trade-offs.

## What I Learned

- How HTTP methods such as GET, POST, and DELETE represent different API operations.
- How JavaScript's Fetch API and async/await handle asynchronous network requests.
- How to display loading, success, empty, and error states in a browser interface.
- How primary keys, foreign keys, and junction tables represent relational data.
- How SQL JOINs and indexes support common application queries.
- How load balancers, application servers, caches, queues, and database replicas support scalability.
- How Git commits track project changes throughout development.

## Future Improvements

- Implement a real backend API and persistent database.
- Add authentication and authorization.
- Support editing notes, searching, filtering, and pagination.
- Add automated tests and continuous integration.
- Deploy the application and API to a cloud platform.

## Author

Developed as a web foundations and system-design capstone project.
