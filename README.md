<div align="center">

# 📝 Todo Task API

**A full-stack task management app** built with **ASP.NET Core Web API (.NET 10)** on the backend and **React + TypeScript + Vite** on the frontend, secured with **JWT Authentication**.

![.NET](https://img.shields.io/badge/.NET-10-512BD4?logo=dotnet&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)
![SQL Server](https://img.shields.io/badge/SQL%20Server-EF%20Core-CC2927?logo=microsoftsqlserver&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green.svg)

</div>

---

## 📸 Preview

> _Add a screenshot or GIF of the app here — this is the single biggest thing that makes a repo look alive._
>
> `![App preview](docs/preview.gif)`

---

## ✨ Features

- 🔐 User registration & login with **JWT Authentication**
- 🔒 Secure password hashing (no plain-text passwords, ever)
- ✅ Full CRUD for personal tasks (create, read, update, delete)
- 👤 Tasks are scoped per user — you only ever see your own data
- 🗄️ SQL Server persistence via Entity Framework Core (code-first migrations)
- ⚛️ React + TypeScript frontend talking to the API over REST

## 🛠️ Tech Stack

| Layer      | Technology |
|------------|------------|
| Backend    | ASP.NET Core Web API (.NET 10), Entity Framework Core, JWT Bearer Auth |
| Database   | SQL Server |
| Frontend   | React 19, TypeScript, Vite |
| Auth       | JWT (JSON Web Tokens), ASP.NET `PasswordHasher` |

## 🏗️ Project Structure

```
TodoTaskApi/
│
├── Controllers/        # API endpoints (Auth, Tasks)
├── Services/            # Business logic (+ Interfaces for DI)
├── DTOs/                 # Request/response contracts (Auth, Tasks)
├── Models/               # EF Core entities (User, TodoTask)
├── Data/                  # AppDbContext
├── Migrations/           # EF Core migrations
├── client/                # React + TypeScript + Vite frontend
└── Program.cs             # App startup & DI configuration
```

## 🚀 Getting Started

### Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- [Node.js](https://nodejs.org/) (18+)
- SQL Server (LocalDB / Express / full instance)

### 1. Clone the repository

```bash
git clone https://github.com/mohammedhany4213-create/TodoTaskApi.git
cd TodoTaskApi
```

### 2. Configure secrets

Don't put real secrets in `appsettings.json`. Use the .NET Secret Manager instead:

```bash
dotnet user-secrets init
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Server=.\SQLEXPRESS;Database=TodoDb;Trusted_Connection=True;TrustServerCertificate=True;"
dotnet user-secrets set "Jwt:Key" "your-own-strong-secret-key"
```

### 3. Apply migrations

```bash
dotnet ef database update
```

### 4. Run the API

```bash
dotnet run
```

### 5. Run the frontend

```bash
cd client
npm install
npm run dev
```

The frontend runs on `http://localhost:3000` and talks to the API via CORS.

## 📡 API Reference

### Auth — `/api/Auth`

| Method | Endpoint | Description | Auth required |
|--------|----------|--------------|:---:|
| `POST` | `/api/Auth/register` | Register a new user | ❌ |
| `POST` | `/api/Auth/login` | Log in and receive a JWT | ❌ |

### Tasks — `/api/Todo`

| Method | Endpoint | Description | Auth required |
|--------|----------|--------------|:---:|
| `GET`  | `/api/Todo` | Get all tasks for the logged-in user | ✅ |
| `GET`  | `/api/Todo/{id}` | Get a single task by id | ✅ |
| `POST` | `/api/Todo` | Create a new task | ✅ |
| `PUT`  | `/api/Todo/{id}` | Update an existing task | ✅ |
| `DELETE` | `/api/Todo/{id}` | Delete a task | ✅ |

> All `Tasks` endpoints require an `Authorization: Bearer <token>` header from a successful login.

## 🗺️ Roadmap

- [ ] Refresh tokens
- [ ] Email verification
- [ ] Role-based authorization
- [ ] Docker support
- [ ] Unit & integration tests
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Live deployment

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">
Built by <a href="https://github.com/mohammedhany4213-create">Mohammed Hany</a>
</div>
