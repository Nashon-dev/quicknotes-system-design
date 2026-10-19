# QuickNotes API Design

## 1. Overview

The QuickNotes API allows users to create, view, update, and delete notes. It follows REST principles and exchanges data using JSON over HTTPS.

**Base URL:** `https://api.quicknotes.example.com/v1`

**Content type:** `application/json`

## 2. API Endpoints

| Method | Endpoint | Description | Success Status |
|---|---|---|---|
| GET | `/notes` | List notes belonging to the authenticated user | 200 OK |
| GET | `/notes/{id}` | Retrieve one note by ID | 200 OK |
| POST | `/notes` | Create a new note | 201 Created |
| PUT | `/notes/{id}` | Replace an existing note | 200 OK |
| PATCH | `/notes/{id}` | Partially update a note | 200 OK |
| DELETE | `/notes/{id}` | Delete a note | 204 No Content |
| GET | `/tags` | List the user's tags | 200 OK |

All endpoints require authentication except any public health-check endpoint that may be introduced separately.

## 3. List Notes

### Request

`GET /v1/notes?page=1&limit=20`

The API returns a paginated list of notes for the authenticated user.

### Example response

HTTP `200 OK`

json
{
  "data": [
    {
      "id": 42,
      "title": "Study plan",
      "body": "Revise cloud computing",
      "created_at": "2026-10-19T08:00:00Z",
      "updated_at": "2026-10-19T08:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1
  }
}


## 4. Create a Note

### Request

`POST /v1/notes`

Example JSON request body:

json
{
  "title": "Study plan",
  "body": "Revise cloud computing"
}


### Example response

HTTP `201 Created`

json
{
  "data": {
    "id": 43,
    "title": "Study plan",
    "body": "Revise cloud computing",
    "created_at": "2026-10-19T08:30:00Z",
    "updated_at": "2026-10-19T08:30:00Z"
  }
}


The server generates the ID and timestamps. Clients must not choose their own note IDs.

## 5. Error Handling

Errors use a consistent JSON structure.

### Example error response

json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The title is required.",
    "details": {
      "field": "title"
    }
  }
}


| Status | Meaning | Example |
|---|---|---|
| 400 Bad Request | Invalid input or malformed request | Missing required title |
| 401 Unauthorized | Authentication is missing or invalid | Expired access token |
| 403 Forbidden | User is authenticated but lacks permission | Attempt to access an unauthorized resource |
| 404 Not Found | Requested resource does not exist | Note ID does not exist |
| 500 Internal Server Error | Unexpected server failure | Database operation fails |

Error responses must not expose passwords, access tokens, database credentials, or internal stack traces.

## 6. Validation and Security

- Note titles are required and limited to 100 characters.
- Request bodies must contain valid JSON.
- The API validates all input on the server, even if the client validates it first.
- Authentication uses a secure access token sent in the `Authorization: Bearer <token>` header.
- Users may access only notes they own.
- HTTPS protects data in transit.
- Parameterized database queries help prevent SQL injection.
- Requests are rate-limited to reduce abuse.

## 7. Pagination and Performance

The list endpoint supports `page` and `limit` query parameters. The API enforces a maximum page size to prevent excessively large responses.

Indexes on commonly queried fields, such as `notes.user_id`, help the database retrieve a user's notes efficiently.

## 8. HTTP Method Semantics

- **GET** retrieves resources without modifying them.
- **POST** creates a resource.
- **PUT** replaces a resource.
- **PATCH** updates selected fields.
- **DELETE** removes a resource.

The production API described here is a proposed design. The current browser client uses JSONPlaceholder for demonstration and does not connect to this production API.
