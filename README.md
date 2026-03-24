# Task Manager API

## Overview

This is a Node.js + Express REST API for managing tasks.

Features:
- Create, read, update, and delete tasks
- Input validation for task payloads
- Filter tasks by completion status
- Sort tasks by creation date
- Assign and query task priority (`low`, `medium`, `high`)


## API Endpoints

### 1) Get all tasks

- Method: `GET`
- URL: `/tasks`
- Optional query params:
  - `completed=true|false`
  - `order=asc|desc` (sort by `createdAt`, default `asc`)
- Success: `200 OK`

Example:

```bash
curl "http://localhost:3000/tasks"
```

Filtered + sorted:

```bash
curl "http://localhost:3000/tasks?completed=true&order=desc"
```

### 2) Get task by ID

- Method: `GET`
- URL: `/tasks/:id`
- Success: `200 OK`
- Not found: `404 Not Found`

Example:

```bash
curl "http://localhost:3000/tasks/1"
```

### 3) Create task

- Method: `POST`
- URL: `/tasks`
- Required JSON body:
  - `title` (non-empty string)
  - `description` (non-empty string)
  - `completed` (boolean)
- Optional:
  - `priority` (`low` | `medium` | `high`) - defaults to `medium`
- Success: `201 Created`
- Invalid input: `400 Bad Request`

Example:

```bash
curl -X POST "http://localhost:3000/tasks" \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"Write docs\",\"description\":\"Prepare README\",\"completed\":false,\"priority\":\"high\"}"
```

Invalid payload example (`400`):

```bash
curl -X POST "http://localhost:3000/tasks" \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"\",\"description\":\"   \",\"completed\":\"true\"}"
```

### 4) Update task

- Method: `PUT`
- URL: `/tasks/:id`
- Required JSON body:
  - `title` (non-empty string)
  - `description` (non-empty string)
  - `completed` (boolean)
- Optional:
  - `priority` (`low` | `medium` | `high`)
- Success: `200 OK`
- Invalid input: `400 Bad Request`
- Not found: `404 Not Found`

Example:

```bash
curl -X PUT "http://localhost:3000/tasks/1" \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"Write tests\",\"description\":\"Add API tests\",\"completed\":true,\"priority\":\"medium\"}"
```

### 5) Delete task

- Method: `DELETE`
- URL: `/tasks/:id`
- Success: `200 OK`
- Not found: `404 Not Found`

Example:

```bash
curl -X DELETE "http://localhost:3000/tasks/1"
```

### 6) Get tasks by priority

- Method: `GET`
- URL: `/tasks/priority/:level`
- `:level` values: `low`, `medium`, `high`
- Success: `200 OK`
- Invalid priority: `400 Bad Request`

Example:

```bash
curl "http://localhost:3000/tasks/priority/high"
```

## Testing the API

### Option 1: curl
Use the curl examples above for each endpoint.

### Option 2: Postman
1. Create a new collection.
2. Add requests for all endpoints listed above.
3. Set base URL to `http://localhost:3000`.
4. For `POST` and `PUT`, use `Body -> raw -> JSON`.
5. Verify status codes (`200`, `201`, `400`, `404`) and response body.

### Automated tests

```bash
node test/server.test.js
```
