# Gestione Eccezioni

Il `GlobalExceptionHandler` gestisce tutte le eccezioni in modo centralizzato.

## Principi di Sicurezza

- Mai esporre dettagli tecnici (SQL, stacktrace) all'utente
- Messaggi di errore sempre in italiano e user-friendly
- Dettagli tecnici loggati solo lato server per debug

## Tipi di Eccezioni Gestite

| Eccezione | HTTP Status | Uso |
|-----------|-------------|-----|
| `ResourceNotFoundException` | 404 | Risorsa non trovata |
| `BusinessException` | 400 | Violazione regole di business |
| `DataIntegrityViolationException` | 409 | Vincoli DB (UNIQUE, FK) |
| `MethodArgumentNotValidException` | 400 | Validazione fallita |
| `Exception` (catch-all) | 500 | Errori generici (messaggio generico) |

## Esempio Messaggi Utente

| Errore tecnico | Messaggio utente |
|----------------|------------------|
| Duplicate entry 'X' for key 'nome' | "Esiste già una camera con questo numero." |
| Foreign key constraint | "Impossibile eliminare: esistono prenotazioni associate." |
| NullPointerException | "Si è verificato un errore interno del server." |

## File di Riferimento

- `backend/src/main/java/com/backend/gestionale_motel/exception/GlobalExceptionHandler.java`
- `backend/src/main/java/com/backend/gestionale_motel/exception/ResourceNotFoundException.java`
- `backend/src/main/java/com/backend/gestionale_motel/exception/BusinessException.java`
