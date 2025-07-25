# User Management System – Requirements Document

## Project Overview
Build a full-stack user management application that allows creating, reading, updating, and deleting user records. This project will serve as a practice exercise for implementing a complete end-to-end application with modern technologies.

## Technology Stack
### Frontend
- Framework: React 18+
- UI Library: Ant Design (antd) 5.x
- Styling: Styled Components
- Language: TypeScript
- Build Tool: Vite with TypeScript template
- HTTP Client: Axios

### Backend
- Runtime: Node.js 18+
- Framework: Express.js
- Language: TypeScript
- ORM/Query Builder: TypeORM
- API Documentation: Swagger/OpenAPI

### Database
- Database: PostgreSQL 14+
- Schema Management: Migrations through chosen ORM

### Deployment
- Containerization: Docker
- Orchestration: Docker Compose
- Environment Management: .env files

## Functional Requirements
### 1. User Model
The user entity should have the following fields:
```ts
interface User {
  id: string;           // UUID, auto-generated
  firstName: string;    // Required, max 50 chars
  lastName: string;     // Required, max 50 chars
  email: string;        // Required, unique, valid email format
  phoneNumber: string;  // Optional, format: +1-XXX-XXX-XXXX
  dateOfBirth: Date;    // Required
  address: {
    street: string;     // Required, max 100 chars
    city: string;       // Required, max 50 chars
    state: string;      // Required, 2 char code (for US)
    zipCode: string;    // Required, 5 digits
    country: string;    // Required, default: "USA"
  };
  department: string;   // Required, enum: ["Engineering", "Marketing", "Sales", "HR", "Finance", "Operations"]
  position: string;     // Required, max 50 chars
  startDate: Date;      // Required
  status: string;       // Required, enum: ["Active", "Inactive", "On Leave"]
  createdAt: Date;      // Auto-generated
  updatedAt: Date;      // Auto-updated
}
```

### 2. API Endpoints
Base URL: `/api/v1`
| Method | Endpoint           | Description               | Request Body                            | Response              |
|--------|--------------------|---------------------------|-----------------------------------------|-----------------------|
| GET    | /users             | Get all users with pagination | Query params: page, limit, search, department, status | Paginated user list   |
| GET    | /users/:id         | Get single user by ID     | None                                    | User object           |
| POST   | /users             | Create new user           | User object (without id, createdAt, updatedAt) | Created user object   |
| PUT    | /users/:id         | Update existing user      | Partial user object                     | Updated user object   |
| DELETE | /users/:id         | Delete user               | None                                    | Success message       |
| GET    | /users/stats       | Get user statistics       | None                                    | Statistics object     |

#### API Response Format
```json
// Success Response
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}

// Error Response
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message"
  }
}

// Paginated Response
{
  "success": true,
  "data": {
    "users": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "totalPages": 10
    }
  }
}
```

### 3. Frontend Features
#### 3.1 User List Page (`/users`)
- Display users in a table with columns: Name, Email, Department, Position, Status (color coded), Actions (Edit, Delete)
- Pagination (10 per page), search, filter by department/status, sort by name/email/start date
- Bulk actions: select and delete

#### 3.2 Create User Page (`/users/new`)
- Form with all user fields
- Client-side validation (required, email, phone, DOB 18+, start date not future)
- Real-time feedback, notifications, redirect after creation

#### 3.3 Edit User Page (`/users/:id/edit`)
- Pre-populated form, same validations, show last updated, cancel button

#### 3.4 User Details Page (`/users/:id`)
- Read-only view, formatted sections, edit/delete/back buttons

#### 3.5 Dashboard/Statistics Page (`/`)
- Total users, users by department (pie), status (bar), recent additions, quick add

### 4. Non-Functional Requirements
#### 4.1 Frontend
- Responsive, loading states, error boundaries, toasts, theme, strict TS, ESLint/Prettier

#### 4.2 Backend
- Input validation, error handling, logging, CORS, strict TS, ESLint

#### 4.3 Database
- Indexing, migrations

### Docker Configuration
- Frontend/Backend Dockerfiles, nginx.conf, docker-compose.yml as specified

### Project Structure
- As detailed in the original requirements document

### Notes
- Code quality, frequent commits, env vars, RESTful, strict types, edge cases, accessibility
