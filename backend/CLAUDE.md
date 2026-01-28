# Parlami sempre in italiano
# CLAUDE.md - Gestionale Motel Backend

## Descrizione Progetto
Sistema di gestione per hotel/motel di piccole-medie dimensioni. Backend REST API completo per gestione prenotazioni, camere, ospiti, tariffe e pagamenti.

## Stack Tecnologico
- **Java**: 21
- **Framework**: Spring Boot 3.4.2
- **Database**: MySQL 8.x
- **ORM**: Hibernate + Spring Data JPA
- **Migrazioni DB**: Flyway
- **Autenticazione**: JWT (Bearer token, scadenza 24h)
- **Build**: Maven
- **Librerie**: Lombok, Jakarta Bean Validation, BCrypt

## Comandi Principali
```bash
# Compilazione
./mvnw clean compile

# Build JAR
./mvnw clean package

# Avvio applicazione (porta 8080)
./mvnw spring-boot:run

# Esecuzione JAR
java -jar target/gestionale-motel-0.0.1-SNAPSHOT.jar
```

## Struttura Progetto
```
src/main/java/com/backend/gestionale_motel/
├── config/          # Configurazioni Spring Security e JWT
├── controller/      # 16 REST Controller
├── service/         # 17 Service (logica business)
├── repository/      # 16 Repository JPA
├── entity/          # 20 Entity JPA
├── dto/             # 22 DTO
└── exception/       # Gestione eccezioni centralizzata

src/main/resources/
├── application.properties
└── db/migration/    # 25 script Flyway (V1-V25)
```

## Architettura
```
Controller REST (@RestController)
       ↓
Service Layer (@Service, @Transactional)
       ↓
Repository Layer (Spring Data JPA)
       ↓
Entity JPA + MySQL
```

## Entità Principali
| Entità | Descrizione |
|--------|-------------|
| `Prenotazione` | Check-in/out, stato, prezzo, camera |
| `Camera` | Numero, tipologia, stato pulizia |
| `Ospite` | Anagrafica, documento, cittadinanza |
| `Tariffa` | Prezzo per tipologia + periodo |
| `TipologiaCamera` | Nome, capienza massima |
| `PeriodoTariffario` | Date inizio/fine, nome |
| `Pagamento` | Importo, metodo, data |
| `CategoriaSpesa` | Categoria per classificare le spese |
| `Spesa` | Uscite operative (utenze, manutenzione, ecc.) |
| `Configurazione` | Parametri sistema (singleton id=1) |

## Enum
- `StatoPrenotazione`: CONFERMATA, IN_CORSO, COMPLETATA, CANCELLATA
- `StatoPulizia`: PULITA, DA_PULIRE, IN_PULIZIA
- `Sesso`: M, F
- `Ruolo`: ADMIN, RECEPTIONIST, HOUSEKEEPING

## API Principali
| Endpoint | Descrizione |
|----------|-------------|
| `POST /api/auth/login` | Autenticazione, ritorna JWT |
| `GET/POST /api/prenotazioni` | CRUD prenotazioni |
| `GET /api/prenotazioni/arrivi-oggi` | Arrivi del giorno |
| `GET /api/prenotazioni/partenze-oggi` | Partenze del giorno |
| `GET/POST /api/camere` | CRUD camere |
| `GET /api/camere/disponibili` | Camere libere per periodo |
| `GET /api/camere/da-pulire` | Camere da pulire |
| `GET/POST /api/ospiti` | CRUD ospiti |
| `GET/POST /api/tariffe` | CRUD tariffe |
| `GET /api/tariffe/calcola-prezzo` | Calcolo prezzo soggiorno |
| `GET /api/dashboard` | Statistiche giornaliere |
| `GET /api/dashboard/planning` | Planning prenotazioni |
| `GET/POST /api/categorie-spesa` | CRUD categorie spesa |
| `GET/POST /api/spese` | CRUD spese/uscite |
| `GET /api/spese/totale` | Totale spese per periodo |

## Convenzioni di Codice
- **Lingua**: Italiano per nomi entità, variabili e commenti
- **Injection**: Constructor injection con `@RequiredArgsConstructor` (Lombok)
- **Transazioni**: `@Transactional` sui metodi service di modifica
- **Soft Delete**: Flag `attivo` per cancellazione logica
- **DTO Pattern**: Mai esporre Entity nei controller
- **Validazione**: Jakarta Bean Validation su DTO ed Entity
- **Eccezioni**: `ResourceNotFoundException` (404), `BusinessException` (400)

## Database
- **Nome DB**: `gestionale_motel`
- **Connessione**: `jdbc:mysql://localhost:3306/gestionale_motel`
- **Credenziali dev**: root / changeme_root
- **DDL**: Gestito da Flyway (mai modificare manualmente)
- **Hibernate ddl-auto**: validate

## Sicurezza
- Endpoint pubblici: `/api/auth/**`
- Tutti gli altri endpoint richiedono header: `Authorization: Bearer <token>`
- Password hashate con BCrypt (strength 10)
- Token JWT valido 24 ore

## Note Importanti
- Le migrazioni Flyway sono in `src/main/resources/db/migration/`
- Per aggiungere una migrazione: creare file `V{n}__descrizione.sql`
- L'utente admin default viene creato da V17
- La configurazione è singleton (id=1), gestita da `ConfigurazioneService`
- I lookup (Comuni, Stati, TipiDocumento) sono popolati dalle migrazioni
