# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Parlami sempre in italiano

## Project Overview

Full-stack hotel/motel management system (Gestionale Motel) for small-to-medium Italian accommodation businesses. Manages bookings, rooms, guests, pricing, and payments.

## Architecture

```
┌─────────────────────┐     REST/JWT      ┌─────────────────────┐
│  Angular 17 SPA     │ ◄───────────────► │  Spring Boot 3.4    │
│  localhost:4200     │                   │  localhost:8080     │
└─────────────────────┘                   └──────────┬──────────┘
                                                     │
                                                     ▼
                                          ┌─────────────────────┐
                                          │  MySQL 8.x          │
                                          │  gestionale_motel   │
                                          └─────────────────────┘
```

**Monorepo structure:**
- `/frontend` - Angular 17 standalone components SPA
- `/backend` - Spring Boot REST API with Java 21

See `backend/CLAUDE.md` and `frontend/CLAUDE.md` for component-specific details.

## Quick Start

**Prerequisites:** Java 21, Node.js, MySQL 8.x

```bash
# Start MySQL with database 'gestionale_motel'

# Terminal 1 - Backend (port 8080)
cd backend && ./mvnw spring-boot:run

# Terminal 2 - Frontend (port 4200)
cd frontend && npm install && npm start
```

## Build Commands

**Backend:**
```bash
./mvnw clean compile              # Compile
./mvnw clean package              # Build JAR
./mvnw spring-boot:run            # Run dev server
```

**Frontend:**
```bash
npm start                         # Dev server at :4200
npm run build                     # Production build
npm test                          # Unit tests (Karma/Jasmine)
```

## Database

- **Connection:** `jdbc:mysql://localhost:3306/gestionale_motel`
- **Dev credentials:** root / changeme_root
- **Migrations:** Flyway in `backend/src/main/resources/db/migration/` (V1-V19)
- **Schema changes:** Create new `V{n}__description.sql` file, never modify existing

## Authentication

- JWT Bearer tokens (24h expiration)
- Login: `POST /api/auth/login`
- All other endpoints require `Authorization: Bearer <token>` header
- Frontend stores token in localStorage, injects via AuthInterceptor

## Key Domain Entities

| Entity | Description |
|--------|-------------|
| Prenotazione | Booking: check-in/out dates, status, price, camera |
| Camera | Room: number, type, cleaning status |
| Ospite | Guest: personal info, document, citizenship |
| Tariffa | Price: per room type + pricing period |
| Configurazione | System settings (singleton, id=1) |

## Conventions

- **Language:** Italian for entity names, variables, comments, and documentation
- **Soft delete:** `attivo` boolean flag for logical deletion
- **DTOs:** Never expose JPA entities in REST responses
- **Flyway:** All schema changes via migrations, `ddl-auto=validate`

## API Reference

See `backend/RIEPILOGO_API.md` for complete endpoint documentation.
