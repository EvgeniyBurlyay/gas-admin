# Gas Admin Service

A simple Node.js API for managing technical gases with PostgreSQL. Includes user registration, login and role-based access control.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy `.env.example` to `.env` and adjust credentials.

3. Start PostgreSQL and create the database specified in `.env`.

4. Run the application:

```bash
npm start
```

Tables are created automatically on startup if they do not exist.

## API Endpoints

- `POST /auth/register` – Register a new user (`username`, `password`, `role`).
- `POST /auth/login` – Obtain a JWT token.
- `GET /gases` – List gases. Auth required.
- `GET /gases/:id` – Get gas by id. Auth required.
- `POST /gases` – Create gas (admin, manager).
- `PUT /gases/:id` – Update gas (admin, manager, warehouse).
- `DELETE /gases/:id` – Delete gas (admin).

Roles available: `admin`, `manager`, `warehouse`, `viewer`.
