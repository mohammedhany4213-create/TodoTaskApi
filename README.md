![.NET CI](https://github.com/mohammedhany4213-create/TodoTaskApi/actions/workflows/dotnet-ci.yml/badge.svg)
# TodoTaskApi

A simple full-stack task management application built with **ASP.NET Core Web API (.NET 10)** and **React + TypeScript + Vite**.

## Features

- User registration and login
- JWT authentication
- Secure password hashing with ASP.NET `PasswordHasher`
- Create, read, update, and delete tasks
- User-scoped task access
- SQL Server with Entity Framework Core
- Code-first EF Core migrations
- React + TypeScript frontend
- OpenAPI documentation in development

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | ASP.NET Core Web API (.NET 10) |
| ORM | Entity Framework Core |
| Database | SQL Server |
| Authentication | JWT Bearer |
| Frontend | React 19 + TypeScript + Vite |
| Styling | Tailwind CSS |

## Project Structure

```text
TodoTaskApi/
├── server/                  # ASP.NET Core Web API
│   ├── Controllers/
│   ├── Data/
│   ├── DTOs/
│   ├── Exceptions/
│   ├── Migrations/
│   ├── Models/
│   ├── Services/
│   │   └── Interfaces/
│   ├── Properties/
│   ├── Program.cs
│   ├── TodoApi.csproj
│   ├── appsettings.json
│   └── appsettings.Development.json
│
├── client/                  # React frontend
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.*
│
├── TodoTaskApi.sln          # Root solution
├── .gitignore
└── README.md
```

## Requirements

- .NET 10 SDK
- Node.js 18+
- SQL Server / SQL Server Express

## Configuration

Never commit real secrets to GitHub.

The API expects the following configuration values:

```text
ConnectionStrings:DefaultConnection
Jwt:Key
Jwt:Issuer
Jwt:Audience
Jwt:DurationInMinutes
```

For local development, use .NET User Secrets from the `server` directory:

```bash
cd server
dotnet user-secrets set "Jwt:Key" "your-strong-secret-key-at-least-32-characters"
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "your-local-sql-server-connection-string"
```

## Run the Backend

```bash
cd server
dotnet restore
dotnet ef database update
dotnet run
```

The API uses HTTPS in development. The exact local URL is shown by `dotnet run`.

OpenAPI is available in the Development environment.

## Run the Frontend

```bash
cd client
npm install
npm run dev
```

Vite uses port `5173` by default.

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/Auth/register` | Register a new user |
| POST | `/api/Auth/login` | Login and receive a JWT |

### Tasks

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/Tasks` | Get the current user's tasks |
| GET | `/api/Tasks/{id}` | Get one of the current user's tasks |
| POST | `/api/Tasks` | Create a task |
| PUT | `/api/Tasks/{id}` | Update a task |
| DELETE | `/api/Tasks/{id}` | Delete a task |

Task endpoints require:

```text
Authorization: Bearer <token>
```

## Development Notes

- Secrets belong in User Secrets or environment variables, not source control.
- Database migrations are kept under `server/Migrations`.
- Backend and frontend are intentionally separated into `server` and `client`.
- The root directory is reserved for shared repository files and the solution file.

## License

MIT
