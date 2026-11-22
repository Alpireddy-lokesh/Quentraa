# Quentraa - Digital Queue & Appointment Management Platform

## Project Overview

**QueueLess** is a digital queue and appointment management platform for organizations such as hospitals, clinics, banks, service centers, colleges, and government offices.

Visitors can join a queue digitally or with staff assistance. The system creates a token, places it in a centralized queue, and allows counter staff to call the next visitor. Customers can check their token status while a public display shows the currently served token and counter.

The goal is to reduce physical waiting, improve queue visibility, and give managers operational information.

## Technology Stack

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS
- **Backend:** Java 21, Spring Boot, Maven, Spring Security, Spring Data JPA, Hibernate
- **Database:** PostgreSQL
- **Real-time:** WebSocket/STOMP
- **Testing:** JUnit 5, Mockito

## Repository Structure

```
Qentra/
├── frontend/           # Next.js + React + TypeScript + Tailwind
│   ├── app/
│   ├── components/
│   ├── features/
│   ├── lib/
│   └── public/
├── backend/            # Spring Boot + Java 21 + Maven
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   └── resources/
│   │   └── test/
│   └── pom.xml
├── docker-compose.yml  # Local PostgreSQL setup
├── .gitignore          # Excludes secrets, build outputs, node_modules
├── .env.example        # Placeholder environment values only
├── README.md           # This file
└── PROJECT_PLAN.md     # Project requirements and roadmap
```

## Getting Started - Local Development

### Prerequisites

- Java 21
- Maven
- Node.js LTS + npm
- Git
- Docker Desktop (for PostgreSQL)

### 1. Start PostgreSQL with Docker Compose

```bash
docker compose up -d
```

This will start PostgreSQL on `localhost:5432` with the following defaults:
- Database: `queuesless`
- User: `queuesless_user`
- Password: `queuesless_pass`

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and update values:

```bash
cp .env.example .env
```

The backend will read database connection from environment variables.

### 3. Backend Setup

```bash
cd backend
mvn clean install
```

### 4. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:3000` and the backend API at `http://localhost:8080`.

## Development Workflow

1. Create a feature branch for each feature: `git checkout -b feature/queue-token-api`
2. Implement focused changes
3. Run tests: `mvn test` (backend) and `npm test` (frontend)
4. Push the branch: `git push -u origin <branch-name>`
5. Open a pull request for review

## Docker Commands

```bash
# Start all services
docker compose up -d

# Stop all services
docker compose down

# View logs
docker compose logs -f
```

## Next Steps

- Implement backend entities and repositories (Days 5-9 of roadmap)
- Implement authentication and role-based authorization (Days 10-12)
- Build visitor registration and token creation flow (Days 13-15)
- Implement queue engine and counter operations (Days 16-21)
- Build Next.js screens and API integration (Days 22-26)
- Add unit/integration tests (Days 27-31)
- Deploy and document (Days 32-40)