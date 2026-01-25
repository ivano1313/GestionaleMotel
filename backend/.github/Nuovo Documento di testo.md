DOCUMENTO DI ANALISI
Sicurezza - Sistema Gestionale Motel
Versione 1.0 - Appendice al documento principale
1. Introduzione
Questo documento definisce la strategia di sicurezza per il sistema gestionale motel. Pur essendo previsto un singolo utente nella prima versione, l'architettura viene predisposta per supportare evoluzioni future (multi-utente, ruoli differenziati).
2. Strategia di autenticazione
2.1 Tecnologia scelta: JWT
Il sistema utilizza JSON Web Token (JWT) per l'autenticazione. Questa scelta permette:
•	Autenticazione stateless (nessuna sessione sul server)
•	Scalabilità futura senza modifiche architetturali
•	Separazione completa tra frontend Angular e backend Spring Boot
•	Supporto nativo per ruoli e permessi nei claims del token
2.2 Struttura del token
Campo	Descrizione
sub	ID univoco dell'utente
username	Nome utente per visualizzazione
role	Ruolo utente (ADMIN per v1, espandibile)
iat	Timestamp di emissione
exp	Timestamp di scadenza

2.3 Durata e refresh
Parametro	Valore
Durata access token	24 ore
Refresh token	Non previsto in v1
Rinnovo	Nuovo login alla scadenza

3. Endpoint e protezione
3.1 Endpoint pubblici
Accessibili senza autenticazione:
Metodo	Endpoint	Descrizione
POST	/api/auth/login	Autenticazione utente
GET	/api/health	Verifica stato servizio

3.2 Endpoint protetti
Richiedono token JWT valido nell'header Authorization:
Pattern	Descrizione
/api/camere/**	Gestione camere
/api/tipologie/**	Gestione tipologie camera
/api/ospiti/**	Anagrafica ospiti
/api/prenotazioni/**	Gestione prenotazioni
/api/pagamenti/**	Gestione pagamenti
/api/tariffe/**	Gestione tariffe
/api/periodi/**	Periodi tariffari
/api/configurazione/**	Parametri sistema
/api/utenti/**	Gestione utenti

4. Entità UTENTE aggiornata
L'entità UTENTE definita nella Fase 1 viene estesa per supportare l'autenticazione sicura:
Campo	Tipo	Obbl.	Note
id	Long	Sì	Chiave primaria auto-generata
username	String(50)	Sì	Univoco, per il login
password	String(255)	Sì	Hash BCrypt, mai in chiaro
nome	String(100)	Sì	Nome visualizzato
email	String(100)	No	Per recupero password futuro
ruolo	String(20)	Sì	ADMIN per v1, espandibile
attivo	Boolean	Sì	Per disabilitare senza eliminare
dataCreazione	LocalDateTime	Sì	Audit: quando creato
ultimoAccesso	LocalDateTime	No	Audit: ultimo login

4.1 Note sulla password
•	La password viene sempre hashata con BCrypt prima del salvataggio
•	Il campo password non viene mai restituito nelle risposte API
•	Lunghezza minima consigliata: 8 caratteri
5. Flussi di autenticazione
5.1 Flusso login
1.	L'utente inserisce username e password nel form Angular
2.	Il frontend invia POST a /api/auth/login con le credenziali
3.	Il backend verifica username esistente e password corretta
4.	Se valido: genera JWT e lo restituisce nella risposta
5.	Il frontend salva il token in localStorage
6.	Il frontend reindirizza alla dashboard
7.	Se non valido: restituisce errore 401 Unauthorized
5.2 Flusso richieste autenticate
1.	Il frontend aggiunge header: Authorization: Bearer <token>
2.	Il filtro JWT intercetta la richiesta
3.	Valida firma e scadenza del token
4.	Se valido: estrae utente e imposta SecurityContext
5.	La richiesta prosegue verso il controller
6.	Se non valido: restituisce errore 401 o 403
6. Componenti Spring Security
Classi da implementare nel backend:
Classe	Responsabilità
SecurityConfig	Configurazione filtri, endpoint pubblici/protetti
JwtTokenProvider	Generazione e validazione token JWT
JwtAuthenticationFilter	Filtro che intercetta e valida le richieste
UserDetailsServiceImpl	Caricamento utente dal database
AuthController	Endpoint /api/auth/login e /api/auth/logout

7. Sicurezza frontend Angular
Componente	Responsabilità
AuthService	Gestione login, logout, storage token
AuthGuard	Protezione rotte, redirect a login se non autenticato
AuthInterceptor	Aggiunge header Authorization a tutte le richieste
LoginComponent	Form di autenticazione

8. Evoluzioni future (v2+)
L'architettura è predisposta per supportare:
Funzionalità	Note implementative
Multi-utente	Nuovi record in tabella UTENTE
Ruoli differenziati	Aggiungere RECEPTIONIST, PULIZIE al campo ruolo
Refresh token	Nuovo endpoint e logica di rinnovo
Recupero password	Endpoint + invio email
Audit accessi	Nuova tabella LOG_ACCESSO

9. Riepilogo decisioni
Aspetto	Decisione v1	Predisposizione futura
Autenticazione	JWT stateless	Già scalabile
Numero utenti	Uno	Struttura multi-utente
Ruoli	ADMIN unico	Campo ruolo espandibile
Durata sessione	24 ore	Refresh token aggiungibile
Hash password	BCrypt	Standard sicuro
Storage token	localStorage	Valutare httpOnly cookie
