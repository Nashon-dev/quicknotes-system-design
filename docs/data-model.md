
# QuickNotes Database Design

## 1. Overview

QuickNotes uses a relational SQL database to store users, notes, and tags. Each user can own many notes, and each note can have multiple tags.

## 2. Tables and Columns

### users

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | INTEGER | Primary key | Unique user ID |
| name | VARCHAR(100) | NOT NULL | User's display name |
| email | VARCHAR(255) | UNIQUE, NOT NULL | User's email |
| password_hash | VARCHAR(255) | NOT NULL | Secure password hash |
| created_at | TIMESTAMP | NOT NULL | Account creation time |

### notes

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | INTEGER | Primary key | Unique note ID |
| user_id | INTEGER | Foreign key, NOT NULL | Owner of the note |
| title | VARCHAR(100) | NOT NULL | Note title |
| body | TEXT | Nullable | Note content |
| created_at | TIMESTAMP | NOT NULL | Creation time |
| updated_at | TIMESTAMP | NOT NULL | Last update time |

### tags

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | INTEGER | Primary key | Unique tag ID |
| user_id | INTEGER | Foreign key, NOT NULL | Owner of the tag |
| name | VARCHAR(50) | NOT NULL | Tag name |

A unique constraint on `(user_id, name)` prevents a user from creating duplicate tags with the same name.

### note_tags

| Column | Type | Constraints | Description |
|---|---|---|---|
| note_id | INTEGER | Composite primary key, foreign key | Linked note |
| tag_id | INTEGER | Composite primary key, foreign key | Linked tag |

The composite primary key `(note_id, tag_id)` prevents the same tag from being assigned to the same note more than once.

## 3. Relationships

- **Users to notes:** One-to-many. A user can own many notes, but each note belongs to one user.
- **Users to tags:** One-to-many. A user can create multiple tags.
- **Notes to tags:** Many-to-many. A note can have multiple tags, and each tag can be applied to multiple notes.
- **note_tags:** Junction table that implements the many-to-many relationship between notes and tags.

## 4. SQL Schema

The following schema uses SQLite-compatible SQL.

```sql
PRAGMA foreign_keys = ON;

CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notes (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    title VARCHAR(100) NOT NULL CHECK (length(title) <= 100),
    body TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
);

CREATE TABLE tags (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    name VARCHAR(50) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE,
    UNIQUE (user_id, name),
    UNIQUE (id, user_id)
);

CREATE TABLE note_tags (
    note_id INTEGER NOT NULL,
    tag_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    PRIMARY KEY (note_id, tag_id),
    FOREIGN KEY (note_id, user_id)
        REFERENCES notes(id, user_id)
        ON DELETE CASCADE,
    FOREIGN KEY (tag_id, user_id)
        REFERENCES tags(id, user_id)
        ON DELETE CASCADE
);
```

The `user_id` in `note_tags` ensures that a note can only be linked to a tag owned by the same user. For the composite foreign key above, add a matching unique constraint on `(id, user_id)` in `notes` as well:

```sql
CREATE UNIQUE INDEX idx_notes_id_user_id
ON notes(id, user_id);
```

## 5. Example Queries

### Query 1: Retrieve all notes for one user

```sql
SELECT id, title, body, created_at
FROM notes
WHERE user_id = 1
ORDER BY updated_at DESC;
```

This retrieves one user's notes, showing the most recently updated first.

### Query 2: Retrieve notes with their owners

```sql
SELECT
    notes.id,
    notes.title,
    users.name AS owner
FROM notes
JOIN users ON notes.user_id = users.id
ORDER BY notes.created_at DESC;
```

This demonstrates a JOIN between the notes and users tables.

### Query 3: Retrieve notes and their tags

```sql
SELECT
    notes.title,
    tags.name AS tag
FROM notes
JOIN note_tags ON notes.id = note_tags.note_id
JOIN tags ON note_tags.tag_id = tags.id
WHERE notes.user_id = 1;
```

This JOIN retrieves tags associated with a user's notes.

### Query 4: Count notes per user

```sql
SELECT
    users.id,
    users.name,
    COUNT(notes.id) AS note_count
FROM users
LEFT JOIN notes ON users.id = notes.user_id
GROUP BY users.id, users.name;
```

The LEFT JOIN includes users who have not created any notes.

## 6. Indexes

```sql
CREATE INDEX idx_notes_user_updated
ON notes(user_id, updated_at);
```

This index helps retrieve a user's notes in update-date order without scanning every note in the database.

The primary keys and unique constraints also create indexes needed to enforce uniqueness and support lookups.

Indexes improve reads but use extra storage and can slow down writes slightly, so they should target common query patterns.

## 7. Why SQL Instead of NoSQL?

A relational database is appropriate because QuickNotes has clear relationships between users, notes, and tags. Foreign keys and transactions help maintain data integrity, while JOINs support queries across related tables.

A NoSQL database could be useful for a workload requiring flexible document structures or very large horizontal scale. However, it would introduce additional work to enforce relationships and consistency for this data model.

## 8. Data Integrity and Security

- Foreign keys prevent notes and tags from referencing nonexistent users.
- Cascading deletes remove dependent notes, tags, and tag assignments when a user or parent record is deleted.
- Unique constraints prevent duplicate emails, duplicate tag names per user, and duplicate note-tag assignments.
- Passwords are stored as secure password hashes, never as plain text.
- The application must authorize access to each note and tag so users cannot read or modify another user's data.
