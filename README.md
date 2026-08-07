# Todo API

A full-stack Todo application built with ASP.NET Core Web API (.NET 10) and React.

## Features

- User Registration
- User Login
- JWT Authentication
- Secure Password Hashing
- CRUD Operations for Todos
- SQL Server Database
- Entity Framework Core
- RESTful API
- React Frontend

## Tech Stack

### Backend
- ASP.NET Core Web API (.NET 10)
- Entity Framework Core
- SQL Server
- JWT Authentication

### Frontend
- React
- TypeScript
- Vite

## Getting Started

1. Clone the repository

```bash
git clone https://github.com/your-username/TodoApi.git
```

2. Configure the database connection in `appsettings.json`

3. Apply migrations

```bash
dotnet ef database update
```

4. Run the API

```bash
dotnet run
```

5. Run the frontend

```bash
cd client
npm install
npm run dev
```

## Project Structure

```
TodoApi/
│
├── Controllers/
├── Data/
├── DTOs/
├── Models/
├── Services/
├── client/
└── Program.cs
```

## Future Improvements

- Refresh Tokens
- Email Verification
- Role-Based Authorization
- Docker Support
- Unit Testing
- Deployment