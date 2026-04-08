# Todo App — Full Stack Task Management

A production-quality full-stack todo application built as part of a technical assessment. Designed with clean architecture, thoughtful engineering decisions, and a focus on maintainability and scalability.

---

## Tech Stack

**Backend**
- ASP.NET Core (.NET 10) — REST API
- Entity Framework Core — ORM
- SQLite — Database
- JWT — Authentication
- BCrypt — Password hashing
- Swagger/OpenAPI — API documentation

**Frontend**
- React 19 + TypeScript — UI framework
- Vite — Build tool
- Tailwind CSS — Styling
- React Query (@tanstack/react-query) — Server state management
- React Hook Form — Form handling and validation
- Axios — HTTP client with interceptors
- React Router — Client-side routing

**Infrastructure**
- Docker + Docker Compose — Containerized deployment
- Nginx — Frontend serving + reverse proxy

---

## Quick Start

### Prerequisites
- Docker Desktop installed and running

### Run with Docker (Recommended)

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

### Run Locally (Development)

**Backend**
```bash
cd backend/TodoApp
dotnet restore
dotnet run
```
API runs at `https://localhost:7001`
Swagger at `https://localhost:7001/swagger`

**Frontend**
```bash
cd frontend/todo-web-app
npm install
npm run dev
```
App runs at `http://localhost:5173`

---

## Project Structure

```
fh-todo-app/
├── backend/
│   └── TodoApp/
│       ├── Controllers/          # Thin HTTP layer — no business logic
│       ├── Services/             # Business logic
│       │   └── Interfaces/       # Contracts — Dependency Inversion
│       ├── Models/
│       │   ├── Entities/         # EF Core entities
│       │   ├── DTOs/             # Request/Response shapes
│       │   └── Enums/            # TaskStatus, TaskPriority
│       ├── Data/                 # AppDbContext
│       ├── Middleware/           # Global error handling
│       ├── Helpers/              # JWT filter, custom exceptions
│       └── Migrations/           # EF Core migrations
│
├── frontend/
│   └── todo-web-app/
│       └── src/
│           ├── api/              # Axios instance + API calls
│           ├── components/       # Reusable UI components
│           ├── hooks/            # React Query hooks
│           ├── pages/            # Page components
│           ├── routes/           # Routing + protected routes
│           ├── store/            # Auth state
│           ├── types/            # TypeScript interfaces
│           └── utils/            # Token management
│
├── docker-compose.yml
└── README.md
```

---

## Architecture & Design Decisions

### Backend

**Single Project Architecture**
Deliberately chose a single project over Clean Architecture's multi-project setup. For an application of this scope, separate Domain/Application/Infrastructure projects would add complexity without meaningful benefit — architecture should match the problem size.

**SOLID Principles Throughout**
- **Single Responsibility** — Controllers handle HTTP only, Services handle business logic, Middleware handles errors
- **Open/Closed** — New task features extend the ITaskService interface without modifying existing code
- **Liskov Substitution** — Any ITaskService implementation is interchangeable — enables easy mocking in tests
- **Interface Segregation** — IAuthService and ITaskService are separate — controllers only depend on what they need
- **Dependency Inversion** — Controllers depend on interfaces, not concrete implementations

**DTOs Always, Never Raw Entities**
API responses always return DTOs, never EF Core entities directly. This decouples the API contract from the database schema and prevents accidental data exposure.

**Global Error Handling Middleware**
All exceptions are caught centrally with consistent structured responses. Custom exception types (NotFoundException, BadRequestException) map to appropriate HTTP status codes — no error handling scattered across controllers.

**Soft Delete**
Tasks are never permanently deleted — `IsDeleted` flag is set to true. A global query filter on the DbContext automatically excludes deleted tasks from all queries. This preserves data integrity and supports potential audit requirements.

**Explicit Enum Integer Values**
All enum values have explicitly assigned integers (e.g., `Pending = 0, InProgress = 1`). This prevents data corruption if enum order is ever changed during development.

**EF Core Migrations**
Using SQLite with proper EF Core migrations rather than in-memory database. Migrations run automatically on startup ensuring the database is always in sync with the schema.

**JWT Authentication**
Tokens expire after 24 hours. User identity is extracted from JWT claims in controllers — no additional database lookup required per request.

### Frontend

**Layered Architecture**
```
Pages → Hooks → API Layer → Axios Instance → Backend
```
Components never call Axios directly. All server communication goes through the API layer, keeping concerns cleanly separated.

**React Query for Server State**
All server data is managed by React Query. This gives automatic caching, background refetching, and cache invalidation out of the box. After any mutation (create/update/delete), the task list is automatically invalidated and refetched.

**Axios Interceptors**
A single Axios instance handles JWT attachment on every request and global 401 handling. Auth endpoints are excluded from the 401 redirect to allow login error messages to surface correctly.

**Protected Routes**
The `ProtectedRoute` component wraps all authenticated pages. If no token exists in localStorage, the user is redirected to `/login` automatically.

**Real-time Username Validation**
Username availability is checked as the user types with a 500ms debounce — balancing responsiveness with API efficiency.

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
| GET | `/api/tasks` | ✅ | Get all tasks (supports filters) |
| GET | `/api/tasks/{id}` | ✅ | Get task by ID |
| POST | `/api/tasks` | ✅ | Create task |
| PUT | `/api/tasks/{id}` | ✅ | Update task |
| DELETE | `/api/tasks/{id}` | ✅ | Soft delete task |

### Query Parameters (GET /api/tasks)
| Parameter | Values | Description |
|---|---|---|
| `status` | `Pending`, `InProgress`, `Completed` | Filter by status |
| `priority` | `Low`, `Medium`, `High` | Filter by priority |
| `sortBy` | `duedate_asc`, `duedate_desc`, `priority_asc`, `priority_desc` | Sort results |

---

## Features

- ✅ JWT Authentication — Register and Login
- ✅ Real-time username availability check with debounce
- ✅ Create tasks instantly — type and press Enter
- ✅ Full task management — Create, Read, Update, Delete
- ✅ Task properties — Title, Description, Status, Priority, Due Date
- ✅ Filter by Status and Priority
- ✅ Sort by Due Date and Priority (ascending/descending)
- ✅ Soft delete — data retained in database
- ✅ Inline edit with form validation
- ✅ Character counter on title and description
- ✅ Loading, error and empty states throughout
- ✅ Custom delete confirmation modal
- ✅ Automatic JWT attachment on all requests
- ✅ Auto-redirect to login on session expiry
- ✅ Docker Compose — single command deployment

---

## What I Would Add With More Time

**Authentication & Security**
- Refresh token rotation
- Rate limiting on auth endpoints
- Password strength validation
- HTTPS in production Docker setup

**Features**
- Task categories and tags
- Due date reminders
- Drag and drop reordering
- Bulk operations (complete all, delete completed)
- Search across task titles and descriptions
- Task activity/audit log

**Engineering**
- Comprehensive unit and integration test suite
- CI/CD pipeline (GitHub Actions)
- Structured logging (Serilog)
- Health check endpoints
- API versioning
- Pagination for large task lists
- UUIDs instead of integer IDs for public-facing endpoints

**Infrastructure**
- PostgreSQL for production (SQLite for development/demo only)
- Redis for JWT token blacklisting
- HTTPS termination at nginx
- Environment-specific configuration management

---

## Notes

- SQLite is used intentionally for simplicity and portability — in production this would be PostgreSQL
- The JWT secret in `docker-compose.yml` is for demo purposes only — in production this would be injected via secrets management (AWS Secrets Manager, Azure Key Vault etc.)
- Integer IDs are used for simplicity — in a distributed system or public API, UUIDs would be preferred to avoid enumeration attacks