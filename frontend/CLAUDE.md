# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build and Development Commands

```bash
npm start           # Start dev server at http://localhost:4200
npm run build       # Production build to dist/frontend
npm test            # Run unit tests via Karma/Jasmine
npm run watch       # Build with watch mode for development
```

Angular CLI commands:
```bash
ng generate component features/<feature-name>/<component-name>  # Generate component
ng generate service core/services/<service-name>                # Generate service
```

## Architecture Overview

This is an Angular 17 standalone components frontend for a motel management system. It communicates with a Spring Boot backend via REST APIs protected by JWT authentication.

### Core Architecture Layers

- **Components** (`src/app/features/`): Presentational UI, organized by feature area
- **Services** (`src/app/core/services/`): API calls and business logic (16 services total)
- **Guards** (`src/app/core/guards/`): Route protection via AuthGuard
- **Interceptors** (`src/app/core/interceptors/`): JWT token injection via AuthInterceptor
- **Models** (`src/app/core/models/`): TypeScript interfaces mapping backend DTOs

### Key Patterns

**Standalone Components**: No NgModule - each component declares its own imports in `@Component` decorator.

**Authentication Flow**:
1. JWT token stored in localStorage
2. AuthGuard protects all routes except `/login`
3. AuthInterceptor adds `Authorization: Bearer <token>` header
4. 401 responses trigger automatic logout and redirect to `/login`

**State Management**: Simple RxJS BehaviorSubject pattern in services (no NgRx).

### API Configuration

- Development: `http://localhost:8080/api`
- Production: `/api` (relative path)

Backend must be running on port 8080 for local development.

### Feature Modules

| Feature | Route | Description |
|---------|-------|-------------|
| Dashboard | `/dashboard` | Daily operations view (arrivals, departures, cleaning status) |
| Planning | `/planning` | Visual calendar grid (rooms × dates) |
| Prenotazioni | `/prenotazioni` | Booking CRUD with status management |
| Ospiti | `/ospiti` | Guest management with Italian "schedina alloggiati" fields |
| Camere | `/camere` | Room inventory and cleaning status |
| Tariffe | `/tariffe` | Dynamic pricing by room type and period |
| Configurazione | `/configurazione` | System settings (check-in/out times, booking limits) |

### Key Enums (in `core/models/enums.ts`)

- `StatoPrenotazione`: CONFERMATA, IN_CORSO, COMPLETATA, CANCELLATA
- `StatoPulizia`: PULITA, DA_PULIRE
- `Sesso`: M, F

### HTTP Error Handling

The AuthInterceptor handles common errors:
- 401: Auto logout and redirect to `/login`
- 400: Display validation errors from backend `message` field
- 409: Constraint violations (e.g., room already booked)
