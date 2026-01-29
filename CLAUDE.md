# CLAUDE.md

## Parlami sempre in italiano

## Project Overview

Gestionale Motel - sistema full-stack per hotel/motel italiani di piccole-medie dimensioni. Gestisce prenotazioni, camere, ospiti, tariffe, pagamenti, spese e reportistica.

## Ambienti

| Ambiente | Sistema | Database |
|----------|---------|----------|
| **Sviluppo** | WSL2 (Ubuntu) | MariaDB in Docker |
| **Produzione** | Windows | MariaDB in Docker |

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
                                          └─────────────────────┘
```

**Struttura:**
- `/frontend` - Angular 17 standalone components
- `/backend` - Spring Boot REST API con Java 21
- `/docs` - Documentazione dettagliata

## Quick Start

```bash
# 1. Avvia Docker e MariaDB
sudo service docker start
docker-compose up -d

# 2. Backend (porta 8080)
cd backend && ./mvnw spring-boot:run

# 3. Frontend (porta 4200)
cd frontend && npm start
```

## Build Commands

```bash
# Backend
./mvnw clean compile          # Compila
./mvnw clean package          # Build JAR
./mvnw spring-boot:run        # Avvia dev server

# Frontend
npm start                     # Dev server :4200
npm run build                 # Build produzione
npm test                      # Test unitari
```

## Database

- **DBMS:** MariaDB 10.x
- **Connection:** `jdbc:mysql://localhost:3306/gestionale`
- **Credentials dev:** root / changeme_root
- **Migrations:** Flyway `backend/src/main/resources/db/migration/`

## Authentication

- JWT Bearer tokens (scadenza 24h)
- Login: `POST /api/auth/login`
- Header richiesto: `Authorization: Bearer <token>`

## Key Entities

| Entity | Description |
|--------|-------------|
| Prenotazione | Check-in/out, stato, prezzo, camera |
| Camera | Numero, tipologia, stato pulizia |
| Ospite | Anagrafica, documento, cittadinanza |
| Tariffa | Prezzo per tipologia + periodo |
| Pagamento | Importo, metodo, tipo (ACCONTO/CAPARRA/SALDO) |
| CategoriaSpesa | Categoria per classificare le spese |
| Spesa | Uscite operative (utenze, manutenzione, ecc.) |

## Enums

| Enum | Valori |
|------|--------|
| StatoPrenotazione | CONFERMATA, IN_CORSO, COMPLETATA, CANCELLATA |
| StatoPulizia | PULITA, DA_PULIRE |
| TipoPagamento | ACCONTO, CAPARRA, SALDO |

## Funzionalità Principali

- **Dashboard** - Arrivi/partenze del giorno, camere da pulire
- **Planning** - Griglia visuale camere x date
- **Prenotazioni** - CRUD con gestione stati e pagamenti
- **Ospiti** - Anagrafica con dati documento
- **Camere** - Inventario e stato pulizia
- **Tariffe** - Prezzi dinamici per tipologia e periodo
- **Spese** - Registro uscite per categoria
- **Report Incassi** - Per periodo e metodo pagamento
- **Bilancio** - Entrate vs uscite con saldo
- **Export CSV** - Movimenti per commercialista

## Conventions

- **Lingua:** Italiano per nomi, variabili, commenti
- **Date:** Formato dd/MM/yyyy nel frontend
- **Soft delete:** Flag `attivo` per cancellazione logica
- **DTOs:** Mai esporre Entity JPA nei controller
- **Eccezioni:** Messaggi user-friendly, mai esporre SQL

## Documentazione Aggiuntiva

- `docs/docker.md` - Setup e gestione Docker
- `docs/eccezioni.md` - Gestione errori
- `docs/roadmap.md` - Funzionalità future
- `backend/RIEPILOGO_API.md` - Endpoint API
