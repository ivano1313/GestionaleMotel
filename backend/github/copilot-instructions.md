# Istruzioni Progetto: Gestionale Motel (v1.0)

## Stack Tecnologico
* **Backend:** Java 21 + Spring Boot 3.5.7.
* **Frontend:** Angular 17 (Standalone Components).
* **Database:** MySQL/MariaDB (JPA/Hibernate).
* **Sicurezza:** Spring Security + JWT (Stateless).

## Architettura & Pattern
* **Layer:** Usa rigorosamente `Controller` -> `Service` -> `Repository`.
* **Injection:** Usa sempre **Constructor Injection** (Lombok `@RequiredArgsConstructor`).
* **DTO:** Non esporre mai le Entità JPA nel Controller. Usa sempre DTO separati per Request/Response.
* **Eccezioni:** Gestione centralizzata tramite `@ControllerAdvice`.

## Regole di Sicurezza (Critico)
* **Auth:** Autenticazione via JWT (Bearer Token) nell'header `Authorization`. Nessuna sessione server-side.
* **Password:** Hash obbligatorio con **BCrypt** prima del salvataggio. Mai restituire la password nei DTO.
* **Ruoli:** Attualmente esiste un solo ruolo `ADMIN`, ma il sistema deve controllare il campo `ruolo` nel JWT per scalabilità futura.
* **Endpoint Pubblici:** Solo `/api/auth/login` e `/api/health`. Tutto il resto è protetto.

## Modello Dati (Entità)
Il sistema gestisce 11 entità di business:
1.  **UTENTE:** Accesso al sistema (Single-tenant per v1).
2.  **CAMERA:** Collegata a `TIPOLOGIA_CAMERA`. Ha stato pulizia (PULITA/DA_PULIRE).
3.  **PRENOTAZIONE:** Entità centrale. Prezzo "bloccato" alla creazione (non cambia se cambia il listino).
4.  **OSPITE:** Anagrafica centrale condivisa. Dati completi per schedina alloggiati.
5.  **PAGAMENTO:** Supporta pagamenti parziali (1:N con Prenotazione).
6.  **TARIFFA:** Definita per (Tipologia + Periodo Tariffario).

## Regole di Business (Da rispettare nel codice)
* **Prenotazioni:** Inserimento solo manuale. Nessuna integrazione OTA/Channel Manager.
* **Soggiorno:** Orari check-in/out e durate min/max sono configurabili in `CONFIGURAZIONE`.
* **Pulizie:** Solo gestione stato (flag). Nessuna assegnazione personale o turni.
* **Cancellazione:** Non elimina il record, imposta stato `CANCELLATA`. Nessuna penale gestita.
* **Duplicati Ospiti:** Prima di creare un ospite, verificare esistenza per Nome/Cognome/Documento.

## Convenzioni Codice
* Usa `Optional<T>` per i return dei Repository.
* I metodi di modifica stato (es. Check-in) devono essere transazionali (`@Transactional`).
* Nomi tabelle DB: snake_case (es. `OSPITE_PRENOTAZIONE`). Nomi classi Java: PascalCase.