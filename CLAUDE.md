# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Parlami sempre in italiano

## Project Overview

Full-stack hotel/motel management system (Gestionale Motel) for small-to-medium Italian accommodation businesses. Manages bookings, rooms, guests, pricing, and payments.

## Ambienti

| Ambiente | Sistema | Database | Note |
|----------|---------|----------|------|
| **Sviluppo** | WSL2 (Ubuntu) | MariaDB in Docker | Container gestito con Docker Engine |
| **Produzione** | Windows | MariaDB in Docker | PC locale, Docker Compose per tutto lo stack |

## Architecture

```
┌─────────────────────┐     REST/JWT      ┌─────────────────────┐
│  Angular 17 SPA     │ ◄───────────────► │  Spring Boot 3.4    │
│  localhost:4200     │                   │  localhost:8080     │
└─────────────────────┘                   └──────────┬──────────┘
                                                     │
                                                     ▼
                                          ┌─────────────────────┐
                                          │  MariaDB 10.x       │
                                          │  gestionale   │
                                          └─────────────────────┘
```

**Monorepo structure:**
- `/frontend` - Angular 17 standalone components SPA
- `/backend` - Spring Boot REST API with Java 21

See `backend/CLAUDE.md` and `frontend/CLAUDE.md` for component-specific details.

## Quick Start

### Sviluppo (WSL2)

**Prerequisites:** Java 21, Node.js, Docker

```bash
# 1. Avvia Docker e MariaDB
sudo service docker start
docker start mariadb-motel  # se già creato, altrimenti vedi "Setup Docker"

# 2. Backend (port 8080)
cd backend && ./mvnw spring-boot:run

# 3. Frontend (port 4200)
cd frontend && npm install && npm start
```

### Produzione (Windows)

**Prerequisites:** Docker Desktop per Windows (o Docker Engine)

```bash
# Avvia tutto lo stack con Docker Compose
docker-compose -f docker-compose.prod.yml up -d
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

- **DBMS:** MariaDB 10.x (compatibile MySQL)
- **Connection:** `jdbc:mysql://localhost:3306/gestionale`
- **Dev credentials:** root / changeme_root
- **Migrations:** Flyway in `backend/src/main/resources/db/migration/` (V1-V22)
- **Schema changes:** Create new `V{n}__description.sql` file, never modify existing

### Setup Docker (WSL2 senza Docker Desktop)
```bash
# Installa Docker Engine
sudo apt update && sudo apt install docker.io docker-compose

# Avvia Docker
sudo service docker start

# (Opzionale) Permetti uso senza sudo
sudo usermod -aG docker $USER
```

### Avvio MariaDB con Docker
```bash
# Avvia container MariaDB
docker run -d --name mariadb-motel \
  -e MYSQL_ROOT_PASSWORD=changeme_root \
  -e MYSQL_DATABASE=gestionale \
  -p 3306:3306 \
  mariadb:10

# Oppure usa docker-compose (consigliato)
docker-compose up -d
```

### Gestione Docker e Volumi

| Comando | Effetto sui dati |
|---------|------------------|
| `docker-compose up -d` | Avvia container (dati preservati) |
| `docker-compose down` | Ferma container (dati preservati) |
| `docker-compose down -v` | Ferma e **CANCELLA** tutti i dati |
| `docker start mariadb-motel` | Riavvia container esistente |
| `docker stop mariadb-motel` | Ferma container |

**Volume dati:** `gestionale_motel_db`

**Attenzione:** Non usare mai `-v` se vuoi mantenere i dati del database.

## Profili di Configurazione

| Profilo | File | Uso |
|---------|------|-----|
| **default** | `application.properties` | Sviluppo locale |
| **prod** | `application-prod.properties` | Produzione Windows |

Attivare profilo: `--spring.profiles.active=prod`

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

## Gestione Eccezioni

Il `GlobalExceptionHandler` gestisce tutte le eccezioni in modo centralizzato.

**Principi di sicurezza:**
- Mai esporre dettagli tecnici (SQL, stacktrace) all'utente
- Messaggi di errore sempre in italiano e user-friendly
- Dettagli tecnici loggati solo lato server per debug

**Tipi di eccezioni gestite:**

| Eccezione | HTTP Status | Uso |
|-----------|-------------|-----|
| `ResourceNotFoundException` | 404 | Risorsa non trovata |
| `BusinessException` | 400 | Violazione regole di business |
| `DataIntegrityViolationException` | 409 | Vincoli DB (UNIQUE, FK) |
| `MethodArgumentNotValidException` | 400 | Validazione fallita |
| `Exception` (catch-all) | 500 | Errori generici (messaggio generico) |

**Esempio messaggi utente:**
- "Esiste già una camera con questo numero."
- "Impossibile eliminare: esistono prenotazioni associate."
- "Si è verificato un errore interno del server."

## API Reference

See `backend/RIEPILOGO_API.md` for complete endpoint documentation.

## Roadmap / TODO

Funzionalità future da implementare:

| Funzionalità | Priorità | Stato | Note |
|--------------|----------|-------|------|
| **Contabilità base** | Media | Da fare | Tracciare entrate e uscite, bilancio mensile |
| Registro spese/uscite | Media | Da fare | Spese operative, utenze, manutenzione |
| Report incassi | Media | Da fare | Per periodo, per metodo di pagamento |
| Tipo pagamento (Acconto/Saldo/Caparra) | Bassa | Da fare | Per ora usare campo note |
| Export dati per commercialista | Bassa | Da fare | CSV/Excel con movimenti |
| Integrazione POS | Bassa | Non prevista | Motel piccolo, POS esterno sufficiente |

**Note tecniche:**
- Per gli acconti usare il campo `note` del pagamento (es. "Acconto", "Caparra", "Saldo")
- Il POS resta separato (SumUp o simile), i pagamenti si registrano manualmente
- La contabilità completa richiederà nuove entità: `Spesa`, `CategoriaSpesa`, `MovimentoCassa`

## Ultimo Commit

| Campo | Valore |
|-------|--------|
| **Hash** | `649abd6` |
| **Data/Ora** | 2026-01-27 16:39:32 +0100 |
| **Messaggio** | Migliora gestione errori e aggiunge Docker Compose |

**Modifiche incluse:**
- Docker Compose per MariaDB
- GlobalExceptionHandler con messaggi user-friendly
- Migrazione V21 (rimozione UNIQUE su periodo_tariffario.nome)
- Documentazione ambienti e gestione eccezioni
