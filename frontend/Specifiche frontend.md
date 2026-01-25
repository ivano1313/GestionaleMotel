DOCUMENTO DI ANALISI
Frontend Angular
Sistema Gestionale Motel
Versione 1.0
Indice
1. Introduzione
2. Architettura frontend
3. Struttura cartelle
4. Routing e navigazione
5. Autenticazione
6. Servizi Angular
7. Schermate e componenti
8. Gestione stato e dati
9. Gestione errori
10. Evoluzioni future
11. Glossario
 
1. Introduzione
Questo documento definisce le specifiche tecniche per il frontend Angular del sistema gestionale motel. Il frontend comunica con il backend Spring Boot tramite API REST protette da autenticazione JWT.
1.1 Stack tecnologico
Componente	Tecnologia	Note
Framework	Angular 17.3.17	Standalone components
Linguaggio	TypeScript	Tipizzazione statica
Stili	SCSS	Preprocessore CSS
HTTP Client	HttpClient Angular	Con interceptor JWT
Routing	Angular Router	Con guard di autenticazione
State Management	Servizi con BehaviorSubject	Semplice, adatto al progetto
1.2 Requisiti da documenti di analisi
Il frontend deve implementare le funzionalità definite in Analisi_Gestionale_Motel_v1.docx:
Area	Funzionalità richiesta
Dashboard	Arrivi/partenze del giorno, occupazione, camere da pulire
Planning	Griglia visuale camere × giorni
Prenotazioni	CRUD completo, gestione stati, assegnazione ospiti
Ospiti	Anagrafica con dati schedina alloggiati, controllo duplicati
Camere	Gestione camere e tipologie, stato pulizia
Tariffe	Configurazione per tipologia e periodo
Pagamenti	Registrazione pagamenti parziali
Configurazione	Parametri sistema (orari, durate)
 
2. Architettura frontend
2.1 Pattern architetturale
Il frontend segue un'architettura a componenti con separazione delle responsabilità:
Layer	Responsabilità	Esempio
Componenti	Presentazione UI, interazione utente	DashboardComponent
Servizi	Logica business, chiamate API	PrenotazioneService
Guard	Protezione rotte	AuthGuard
Interceptor	Manipolazione richieste HTTP	AuthInterceptor
Modelli	Interfacce TypeScript per i dati	Prenotazione, Ospite
2.2 Componenti standalone
Angular 17 supporta i componenti standalone, che non richiedono moduli. Ogni componente dichiara le proprie dipendenze nel decoratore @Component.
Vantaggi per questo progetto:
Vantaggio	Descrizione
Semplicità	Nessuna gestione di NgModule
Import espliciti	Ogni componente dichiara cosa usa
Lazy loading facile	Caricamento pigro per rotta
Meno boilerplate	Codice più snello
 
3. Struttura cartelle
Organizzazione consigliata del progetto Angular:
src/ ├── app/ │   ├── core/                    # Servizi singleton, guard, interceptor │   │   ├── services/ │   │   │   ├── auth.service.ts │   │   │   ├── prenotazione.service.ts │   │   │   ├── ospite.service.ts │   │   │   ├── camera.service.ts │   │   │   └── ... │   │   ├── guards/ │   │   │   └── auth.guard.ts │   │   ├── interceptors/ │   │   │   └── auth.interceptor.ts │   │   └── models/ │   │       ├── prenotazione.model.ts │   │       ├── ospite.model.ts │   │       └── ... │   ├── features/                # Componenti per funzionalità │   │   ├── auth/ │   │   │   └── login/ │   │   ├── dashboard/ │   │   ├── planning/ │   │   ├── prenotazioni/ │   │   ├── ospiti/ │   │   ├── camere/ │   │   ├── tariffe/ │   │   ├── pagamenti/ │   │   └── configurazione/ │   ├── shared/                  # Componenti riutilizzabili │   │   ├── components/ │   │   └── pipes/ │   ├── app.component.ts │   ├── app.config.ts │   └── app.routes.ts ├── assets/ ├── environments/ └── styles.scss
3.1 Descrizione cartelle
Cartella	Contenuto
core/services	Servizi singleton per chiamate API e logica condivisa
core/guards	Guard per protezione rotte (AuthGuard)
core/interceptors	Interceptor HTTP (aggiunta token JWT)
core/models	Interfacce TypeScript che mappano i DTO del backend
features/	Un sottofolder per ogni area funzionale
shared/	Componenti riutilizzabili (es. modale conferma, tabella generica)
 
4. Routing e navigazione
4.1 Configurazione rotte
Le rotte sono definite in app.routes.ts. Tutte le rotte tranne /login richiedono autenticazione tramite AuthGuard.
Path	Componente	Guard	Descrizione
/login	LoginComponent	No	Form di autenticazione
/dashboard	DashboardComponent	AuthGuard	Schermata principale
/planning	PlanningComponent	AuthGuard	Griglia camere × giorni
/prenotazioni	PrenotazioniListComponent	AuthGuard	Lista prenotazioni
/prenotazioni/nuova	PrenotazioneFormComponent	AuthGuard	Nuova prenotazione
/prenotazioni/:id	PrenotazioneDetailComponent	AuthGuard	Dettaglio prenotazione
/ospiti	OspitiListComponent	AuthGuard	Lista ospiti
/ospiti/nuovo	OspiteFormComponent	AuthGuard	Nuovo ospite
/ospiti/:id	OspiteDetailComponent	AuthGuard	Dettaglio ospite
/camere	CamereListComponent	AuthGuard	Lista camere
/tipologie	TipologieListComponent	AuthGuard	Tipologie camera
/tariffe	TariffeListComponent	AuthGuard	Gestione tariffe
/periodi	PeriodiListComponent	AuthGuard	Periodi tariffari
/configurazione	ConfigurazioneComponent	AuthGuard	Parametri sistema
**	Redirect a /dashboard	-	Rotta fallback
4.2 Navigazione principale
La navigazione avviene tramite una sidebar o navbar con le seguenti voci:
Voce menu	Rotta	Icona suggerita
Dashboard	/dashboard	home
Planning	/planning	calendar
Prenotazioni	/prenotazioni	bookmark
Ospiti	/ospiti	users
Camere	/camere	door-open
Tariffe	/tariffe	euro-sign
Configurazione	/configurazione	cog
 
5. Autenticazione
L'autenticazione segue le specifiche del documento Analisi_Sicurezza_v1.docx.
5.1 Componenti autenticazione
Componente	Responsabilità
AuthService	Login, logout, gestione token in localStorage, verifica stato autenticazione
AuthGuard	Protegge le rotte, reindirizza a /login se non autenticato
AuthInterceptor	Aggiunge header Authorization: Bearer <token> a ogni richiesta
LoginComponent	Form con campi username e password
5.2 Flusso di autenticazione
1. L'utente inserisce username e password nel LoginComponent
2. AuthService chiama POST /api/auth/login con le credenziali
3. Il backend restituisce il token JWT
4. AuthService salva il token in localStorage
5. L'utente viene reindirizzato a /dashboard
6. AuthInterceptor aggiunge il token a tutte le richieste successive
5.3 Gestione scadenza token
Il token ha durata 24 ore. Quando scade:
1. Il backend restituisce errore 401 Unauthorized
2. AuthInterceptor intercetta l'errore
3. AuthService effettua logout (rimuove token)
4. L'utente viene reindirizzato a /login
5.4 AuthService - Metodi principali
Metodo	Return	Descrizione
login(username, password)	Observable<LoginResponse>	Chiama API login, salva token
logout()	void	Rimuove token, redirect a login
isAuthenticated()	boolean	Verifica se token esiste e non è scaduto
getToken()	string | null	Restituisce token da localStorage
 
6. Servizi Angular
Ogni risorsa API ha un servizio dedicato che incapsula le chiamate HTTP.
6.1 Elenco servizi
Servizio	Base URL	Operazioni
AuthService	/api/auth	login
DashboardService	/api/dashboard	getDashboard, getPlanning
PrenotazioneService	/api/prenotazioni	CRUD, cambiaStato, getSaldo
OspiteService	/api/ospiti	CRUD, search, findDuplicati
CameraService	/api/camere	CRUD, getDisponibili, getDaPulire, cambiaStatoPulizia
TipologiaCameraService	/api/tipologie	CRUD
TariffaService	/api/tariffe	CRUD, calcolaPrezzo
PeriodoTariffarioService	/api/periodi	CRUD
MetodoPagamentoService	/api/metodi-pagamento	CRUD
PagamentoService	/api/prenotazioni/{id}/pagamenti	getByPrenotazione, create, getTotale
OspitePrenotazioneService	/api/prenotazioni/{id}/ospiti	getOspiti, addOspite, removeOspite, setTitolare
ConfigurazioneService	/api/configurazione	get, update
ComuneService	/api/comuni	search, getByProvincia
StatoService	/api/stati	search
TipoDocumentoService	/api/tipi-documento	getAll
6.2 Pattern comune dei servizi
Ogni servizio segue lo stesso pattern:
@Injectable({ providedIn: 'root' }) export class PrenotazioneService {   private baseUrl = '/api/prenotazioni';      constructor(private http: HttpClient) {}      getAll(): Observable<Prenotazione[]> {     return this.http.get<Prenotazione[]>(this.baseUrl);   }      getById(id: number): Observable<Prenotazione> {     return this.http.get<Prenotazione>(`${this.baseUrl}/${id}`);   }      create(dto: PrenotazioneDTO): Observable<Prenotazione> {     return this.http.post<Prenotazione>(this.baseUrl, dto);   }      // ... altri metodi }
 
7. Schermate e componenti
7.1 Login
Elemento	Descrizione
Campi	Username (text), Password (password)
Azioni	Pulsante Accedi
Validazione	Campi obbligatori
Errori	Messaggio per credenziali errate (401)
Redirect	A /dashboard dopo login riuscito
7.2 Dashboard
Schermata principale con vista operativa giornaliera.
Sezione	Contenuto	Fonte dati
Arrivi oggi	Lista prenotazioni con check-in oggi	GET /api/prenotazioni/arrivi-oggi
Partenze oggi	Lista prenotazioni con check-out oggi	GET /api/prenotazioni/partenze-oggi
Occupazione	Conteggio camere libere/occupate	GET /api/dashboard
Da pulire	Lista camere con stato DA_PULIRE	GET /api/camere/da-pulire
Azioni rapide dalla dashboard: click su prenotazione apre dettaglio, click su camera da pulire permette cambio stato.
7.3 Planning
Griglia visuale per visualizzare prenotazioni su più giorni.
Elemento	Descrizione
Asse X	Giorni (configurabile: settimana, 2 settimane, mese)
Asse Y	Camere del motel
Celle	Colorate se camera prenotata, vuote se libera
Colori	Diversi per stato prenotazione (Confermata, In corso, ecc.)
Interazione	Click su cella apre dettaglio prenotazione o form nuova
Navigazione	Frecce per scorrere periodo
Fonte dati	GET /api/dashboard/planning?da=...&a=...
7.4 Prenotazioni
7.4.1 Lista prenotazioni
Elemento	Descrizione
Colonne	Camera, Ospite titolare, Check-in, Check-out, Stato, Saldo
Filtri	Per stato, per data, per camera
Ordinamento	Per data check-in (default), per camera
Azioni riga	Visualizza, Modifica stato
Azione globale	Pulsante Nuova prenotazione
7.4.2 Form prenotazione
Campo	Tipo	Validazione	Note
Camera	Select	Obbligatorio	Solo camere disponibili nel periodo
Data check-in	Date picker	Obbligatorio, >= oggi	
Data check-out	Date picker	Obbligatorio, > check-in	
Prezzo totale	Readonly	-	Calcolato automaticamente
Note	Textarea	Opzionale	
Il prezzo viene calcolato chiamando GET /api/tariffe/calcola al cambio di camera o date.
7.4.3 Dettaglio prenotazione
Sezione	Contenuto
Dati prenotazione	Camera, date, stato, prezzo totale
Ospiti	Lista ospiti associati con flag titolare, pulsanti aggiungi/rimuovi
Pagamenti	Lista pagamenti effettuati, totale pagato, saldo dovuto
Azioni	Cambia stato, Aggiungi pagamento, Aggiungi ospite
 
7.5 Ospiti
7.5.1 Lista ospiti
Elemento	Descrizione
Colonne	Cognome, Nome, Documento, Cittadinanza
Ricerca	Campo testo per ricerca su cognome/nome/documento
Azioni riga	Visualizza, Modifica
Azione globale	Pulsante Nuovo ospite
7.5.2 Form ospite
Campi come da schedina alloggiati (Analisi_Gestionale_Motel_v1.docx sezione 3.7.1):
Campo	Tipo	Obbligatorio	Note
Cognome	Text	Sì	
Nome	Text	Sì	
Sesso	Select (M/F)	Sì	
Data nascita	Date picker	Sì	
Luogo nascita	Autocomplete	Sì	Comune italiano o Stato estero
Cittadinanza	Autocomplete	Sì	Da tabella STATO
Tipo documento	Select	Sì	Da tabella TIPO_DOCUMENTO
Numero documento	Text	Sì	
Luogo rilascio	Autocomplete	Sì	Comune italiano o Stato estero
Telefono	Text	No	
Email	Email	No	Validazione formato
All'inserimento, se esistono ospiti con nome/cognome simile o stesso documento, mostrare avviso con possibilità di selezionare anagrafica esistente.
7.6 Camere
7.6.1 Lista camere
Elemento	Descrizione
Colonne	Numero, Tipologia, Stato pulizia
Filtri	Per tipologia, per stato pulizia
Azioni riga	Modifica, Cambia stato pulizia
Azione globale	Pulsante Nuova camera
7.6.2 Gestione tipologie
Campo	Tipo	Validazione
Nome	Text	Obbligatorio, univoco
Capienza massima	Number	Obbligatorio, >= 1
7.7 Tariffe
Griglia di configurazione tariffe per tipologia camera e periodo.
Elemento	Descrizione
Vista	Tabella con tipologie sulle righe, periodi sulle colonne
Celle	Prezzo modificabile inline o click per form
Validazione	Prezzo >= 0
Periodi	Link a gestione periodi tariffari
7.8 Configurazione
Form per parametri globali del sistema:
Campo	Tipo	Descrizione
Orario check-in	Time picker	Orario standard di ingresso
Orario check-out	Time picker	Orario standard di uscita
Durata minima	Number	Notti minime per prenotazione
Durata massima	Number	Notti massime per prenotazione
 
8. Gestione stato e dati
8.1 Approccio semplificato
Per questo progetto, data la complessità limitata (singolo utente, operazioni CRUD standard), non è necessario un sistema di state management complesso come NgRx.
Si utilizza un approccio basato su servizi con BehaviorSubject per condividere stato tra componenti quando necessario.
8.2 Modelli TypeScript
Ogni entità del backend ha un'interfaccia TypeScript corrispondente:
Interfaccia	Campi principali
Prenotazione	id, camera, dataCheckIn, dataCheckOut, stato, prezzoTotale
Ospite	id, cognome, nome, sesso, dataNascita, documento, cittadinanza
Camera	id, numero, tipologia, statoPulizia
TipologiaCamera	id, nome, capienzaMassima, attivo
Tariffa	id, tipologia, periodo, prezzo
PeriodoTariffario	id, nome, dataInizio, dataFine, attivo
Pagamento	id, importo, dataPagamento, metodoPagamento
Configurazione	orarioCheckIn, orarioCheckOut, durataMinima, durataMassima
8.3 Enum
Enum	Valori
StatoPrenotazione	CONFERMATA, IN_CORSO, COMPLETATA, CANCELLATA
StatoPulizia	PULITA, DA_PULIRE
Sesso	M, F
 
9. Gestione errori
9.1 Errori HTTP
Codice	Significato	Azione frontend
400	Bad Request - Validazione fallita	Mostrare errori nei campi del form
401	Unauthorized - Token mancante/scaduto	Redirect a /login
403	Forbidden - Accesso negato	Mostrare messaggio errore
404	Not Found - Risorsa non trovata	Mostrare messaggio, redirect a lista
409	Conflict - Violazione vincolo	Mostrare messaggio specifico (es. camera occupata)
500	Server Error	Mostrare messaggio generico, log per debug
9.2 Formato errore dal backend
Il backend restituisce errori nel formato:
{   "timestamp": "2026-01-21T10:30:00",   "status": 400,   "error": "Bad Request",   "message": "La data di check-out deve essere successiva al check-in",   "path": "/api/prenotazioni" }
9.3 Feedback utente
Tipo	Implementazione
Successo	Toast/snackbar verde con messaggio (es. Prenotazione salvata)
Errore	Toast/snackbar rosso con messaggio dal backend
Loading	Spinner durante caricamento dati
Form invalido	Bordo rosso sui campi con errore, messaggio sotto il campo
 
10. Evoluzioni future
Funzionalità escluse dalla prima versione ma predisposte nell'architettura:
Funzionalità	Note implementative
Multi-utente	AuthService già predisposto per ruoli nel token JWT
Export schedina alloggiati	OspiteService può aggiungere metodo export
Report e statistiche	Nuovo modulo features/report/
Notifiche push	Servizio dedicato con WebSocket
Tema scuro	Variabili SCSS per switch tema
Internazionalizzazione	Angular i18n se necessario
 
11. Glossario
Termine	Definizione
Standalone component	Componente Angular che dichiara le proprie dipendenze senza bisogno di un NgModule
BehaviorSubject	Observable RxJS che mantiene un valore corrente e lo emette ai nuovi subscriber
Guard	Classe Angular che controlla l'accesso alle rotte (es. AuthGuard verifica autenticazione)
Interceptor	Classe che intercetta le richieste/risposte HTTP per modificarle (es. aggiungere token)
Observable	Oggetto RxJS che rappresenta una sequenza di valori nel tempo, usato per operazioni asincrone
DTO	Data Transfer Object - oggetto per trasferire dati tra frontend e backend
Lazy loading	Caricamento di moduli/componenti solo quando necessario, migliora performance iniziale
Toast/Snackbar	Messaggio temporaneo che appare per notificare l'utente di un'azione completata
Autocomplete	Campo di input con suggerimenti mentre l'utente digita
providedIn: root	Indica che il servizio è singleton e disponibile in tutta l'applicazione

