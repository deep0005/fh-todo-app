# Todo App — Full Stack Task Management

A full-stack task management application built with ASP.NET Core and React TypeScript.

---

## Tech Stack

**Backend**
- ASP.NET Core (.NET 10)
- Entity Framework Core + SQLite
- JWT Authentication
- BCrypt password hashing
- Swagger/OpenAPI

**Frontend**
- React 19 + TypeScript
- Vite
- Tailwind CSS
- React Query
- React Hook Form
- Axios
- React Router

**Infrastructure**
- Docker + Docker Compose
- Nginx

---

## Quick Start

### Run with Docker

```bash
git clone https://github.com/deep0005/fh-todo-app.git
cd fh-todo-app
docker-compose up --build
```

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8080 |
| Swagger UI | http://localhost:8080/swagger |

---

### Run Locally

**Backend**
```bash
cd backend/TodoApp
dotnet restore
dotnet run
```

**Frontend**
```bash
cd frontend/todo-web-app
npm install
npm run dev
```

---

### Run Tests
```bash
cd backend/TodoApp/TodoApp.Api.Tests
dotnet test
```

---

## Project Structure

```
fh-todo-app/
├── backend/
│   └── TodoApp/
│       ├── Controllers/
│       ├── Services/
│       │   └── Interfaces/
│       ├── Models/
│       │   ├── Entities/
│       │   ├── DTOs/
│       │   └── Enums/
│       ├── Data/
│       ├── Middleware/
│       ├── Helpers/
│       ├── Migrations/
│       └── TodoApp.Api.Tests/
│           ├── Helpers/
│           └── Services/
│
├── frontend/
│   └── todo-web-app/
│       └── src/
│           ├── api/
│           ├── components/
│           ├── hooks/
│           ├── pages/
│           ├── routes/
│           ├── store/
│           ├── types/
│           └── utils/
│
├── docker-compose.yml
└── README.md
```

---

## Architecture Decisions

**Single project backend**
Kept the backend as a single project rather than splitting into multiple layers. For this scope, additional projects would add complexity without meaningful benefit.

**DTOs on all endpoints**
API responses always return DTOs — never raw EF entities. Keeps the API contract decoupled from the database schema.

**Global error handling**
All exceptions are handled centrally via middleware with consistent structured responses. Custom exception types map to appropriate HTTP status codes.

**Soft delete**
Tasks are never permanently deleted. A global query filter on DbContext automatically excludes deleted records from all queries.

**Explicit enum values**
All enums have explicitly assigned integers to prevent data corruption if order changes in future.

**EF Core migrations**
Migrations run automatically on startup — no manual steps required after deployment.

**React Query for server state**
All server data managed by React Query. Cache is automatically invalidated after any mutation.

**Axios interceptors**
Single Axios instance handles JWT attachment on every request and global 401 handling, with auth endpoints excluded from redirect.

---

## Trade-offs & Assumptions

- **SQLite over a full SQL database** — portable and zero-config, suitable for this scope
- **Integer IDs over UUIDs** — simpler for a single-instance app
- **JWT stored in localStorage** — simpler than httpOnly cookies, acceptable for this scope
- **No refresh tokens** — 24 hour expiry is reasonable, refresh tokens would be added in production
- **Single project backend** — Clean Architecture multi-project structure would be over-engineered for this scope

---

## API Endpoints

### Auth
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | ❌ | Register new user |
| POST | `/api/auth/login` | ❌ | Login, returns JWT |
| GET | `/api/auth/check-username/{username}` | ❌ | Check username availability |

### Tasks
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/tasks` | ✅ | Get all tasks |
| GET | `/api/tasks/{id}` | ✅ | Get task by ID |
| POST | `/api/tasks` | ✅ | Create task |
| PUT | `/api/tasks/{id}` | ✅ | Update task |
| DELETE | `/api/tasks/{id}` | ✅ | Soft delete task |

### Query Parameters (GET /api/tasks)
| Parameter | Values |
|---|---|
| `status` | `Pending`, `InProgress`, `Completed` |
| `priority` | `Low`, `Medium`, `High` |
| `sortBy` | `duedate_asc`, `duedate_desc`, `priority_asc`, `priority_desc` |

---

## Features

- JWT Authentication — Register and Login
- Real-time username availability check with debounce
- Create tasks by typing and pressing Enter
- Full CRUD — Create, Read, Update, Delete
- Task properties — Title, Description, Status, Priority, Due Date
- Filter by Status and Priority
- Sort by Due Date and Priority
- Soft delete
- Inline editing with validation
- Loading, error and empty states
- Custom delete confirmation modal
- Auto-redirect on session expiry
- Single command Docker deployment
- 15 unit tests covering Auth and Task services
- Structured logging across all services

---

## What I Would Add With More Time

- Pagination for large task lists
- Task search
- Refresh token rotation
- Rate limiting on auth endpoints
- CI/CD pipeline
- Switch SQLite to a dedicated SQL database for production
- Secrets management for production credentials

---

## Notes

- SQLite is used for simplicity and portability — suitable for this scope
- JWT secret in `docker-compose.yml` is for demo purposes — production would use proper secrets management