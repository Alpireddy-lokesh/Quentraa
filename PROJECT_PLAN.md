# QueueLess / Qentra - Project Plan

## Project Overview
Digital queue and appointment management platform for organizations (hospitals, clinics, banks, service centers, colleges, government offices).

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
├── README.md           # Setup instructions and overview
└── PROJECT_PLAN.md     # This file
```

## High-Level Architecture

```
Customer / Receptionist / Counter Staff / Manager
                        |
                        v
              Next.js Web Frontend
                        |
                 REST API + WebSocket
                        |
                        v
               Spring Boot Backend
      +----------------+------------------+
      |                |                  |
      v                v                  v
 Authentication    Queue Engine     Branch/Service
 & Authorization  & Token Logic      Management
      |                |                  |
      +----------------+------------------+
                        |
                        v
                   PostgreSQL
```

## Queue States (Important Concepts)
- WAITING - Token is in the queue waiting to be called
- CALLED - Token has been called by counter staff
- SERVING - Token is currently being served
- COMPLETED - Service is finished
- SKIPPED - Token was skipped according to queue rules
- CANCELLED - Token was cancelled

The queue engine should prevent invalid state transitions. Token generation and queue updates should be handled safely in database transactions.

## GitHub Collaboration Workflow
1. Check `git status` and `git branch`
2. Create a feature branch: `git checkout -b feature/queue-token-api`
3. Implement a small, focused change
4. Run tests and review the diff
5. Push the branch: `git push -u origin feature/queue-token-api`
6. Open a pull request for review and merge

## Local Development Setup

### Prerequisites
- Java 21
- Maven
- Node.js LTS
- npm
- PostgreSQL (or Docker Desktop with Docker Compose)
- Git
- IDE/editor (IntelliJ IDEA or VS Code)

### Using Docker Compose
```bash
docker compose up -d    # Start PostgreSQL
docker compose down     # Stop PostgreSQL
```

### Backend
```bash
cd backend
mvn clean install       # Build and test
mvn spring-boot:run     # Run the application
```

### Frontend
```bash
cd frontend
npm install
npm run dev             # Development server at http://localhost:3000
```

## Development Roadmap (Approximately 40 days)

| Days | Focus | Deliverable |
|------|-------|-------------|
| 1-4 | Requirements, use cases, ER diagram, API design | Project design artifacts |
| 5-9 | Spring Boot setup, PostgreSQL, entities, repositories | Backend foundation |
| 10-12 | Authentication and Secure login, role-based authorization | Secure API |
| 13-15 | Branch, department, service, counter management | Admin APIs |
| 16-19 | Visitor registration and token creation | Registration flow |
| 20-26 | Queue engine and counter operations | Queue logic |
| 27-31 | Next.js screens and API integration | Frontend integration |
| 32-35 | Unit/integration tests, error validation | Tested application |
| 36-40 | Deployment, portfolio release documentation | Deployed project |

## Free/Low-Cost Deployment Plan

### Frontend: Vercel Hobby
- Use Vercel Hobby for Next.js frontend
- Connect to GitHub for automatic deployments and preview builds
- Official: https://vercel.com/pricing

### Backend: Render Free Web Service
- Spring Boot backend as Docker-based web service
- Free service may spin down after inactivity (cold start)
- Ephemeral filesystem - acceptable for portfolio demo
- Official: https://render.com/pricing

### Database: Neon PostgreSQL
- Free PostgreSQL tier
- Suitable for small demo if plan supports usage
- Official: https://neon.tech/pricing

### CI: GitHub Actions
- Run backend tests and frontend checks on pull requests
- Free usage depends on repository visibility and runner type
- Official: https://github.com/features/actions

## Testing Strategy

### Backend Unit Tests
Test services such as:
- Token generation
- Queue ordering
- Calling next token
- Completing service
- Skipping or cancelling a token
- Invalid state transitions
- Role-based access rules

### Integration Tests
- REST endpoints
- Database persistence
- Transaction behavior
- Authentication and authorization
- Concurrent token creation
- WebSocket event publication

### Frontend Checks
- Form validation
- Loading and error states
- API integration
- Role-based navigation
- Responsive layout
- Customer token status updates

Do not claim test coverage or performance results unless actually measured.

## Resume Positioning

**Project Title:** Qentra --- Inclusive Digital Queue & Appointment Management Platform

**Technology line:** Java, Spring Boot, Spring Security, Spring Data JPA, PostgreSQL, Next.js, TypeScript, WebSocket, Docker, GitHub Actions

**Resume description:** Built a full-stack queue management platform that enables visitors to join service queues digitally and track token status. Implemented REST APIs using Spring Boot for visitor registration, token generation, queue operations, and branch/service management. Designed PostgreSQL entities and transactional backend logic to manage queue state and token lifecycle. Added role-based access for managers, receptionists, and counter staff. Implemented real-time queue updates using WebSocket. Added automated backend tests and documented APIs for easier validation and maintenance. Containerized the application and configured CI checks and deployment workflows.

Important: Keep only the bullets that are true for the implemented version. Do not present planned features as completed work.