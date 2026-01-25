# Flusso Operativo - Gestionale Motel
**Sistema di gestione per motel - Frontend Angular**

---

## 📋 Indice
1. [Panoramica](#panoramica)
2. [Architettura dell'applicazione](#architettura-dellapplicazione)
3. [Flusso di autenticazione](#flusso-di-autenticazione)
4. [Flusso operativo principale](#flusso-operativo-principale)
5. [Dettaglio flussi per area funzionale](#dettaglio-flussi-per-area-funzionale)
6. [Pattern tecnici utilizzati](#pattern-tecnici-utilizzati)

---

## Panoramica

L'applicazione è un **gestionale per motel** sviluppato in **Angular 17.3** con architettura **standalone components** che consente di:
- Gestire prenotazioni di camere
- Anagrafica ospiti (schedina alloggiati)
- Pianificazione occupazione camere (planning)
- Gestione tariffe e configurazione sistema

### Stack Tecnologico
- **Framework**: Angular 17.3.17 (standalone components)
- **Linguaggio**: TypeScript
- **Stili**: SCSS
- **Comunicazione API**: HttpClient con interceptor JWT
- **State Management**: Servizi con BehaviorSubject (no NgRx)
- **Routing**: Angular Router con lazy loading

---

## Architettura dell'applicazione

### Struttura a Layer

```
┌─────────────────────────────────────────────┐
│           UI Components Layer               │
│  (features/dashboard, planning, etc.)       │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│           Services Layer                    │
│  (DashboardService, PrenotazioneService)    │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│      HTTP Client + Interceptor              │
│  (AuthInterceptor aggiunge token JWT)       │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│           Backend API REST                  │
│        (Spring Boot + JWT)                  │
└─────────────────────────────────────────────┘
```

### Organizzazione Cartelle

```
src/app/
├── core/                    # Servizi singleton e logica core
│   ├── guards/              # AuthGuard (protezione rotte)
│   ├── interceptors/        # AuthInterceptor (aggiunta token)
│   ├── models/              # Interfacce TypeScript (DTO)
│   └── services/            # Servizi API
├── features/                # Componenti per funzionalità
│   ├── auth/login/          # Login
│   ├── dashboard/           # Vista operativa giornaliera
│   ├── planning/            # Griglia camere × giorni
│   ├── prenotazioni/        # CRUD prenotazioni
│   ├── ospiti/              # Anagrafica ospiti
│   ├── camere/              # Gestione camere
│   ├── tariffe/             # Configurazione tariffe
│   └── configurazione/      # Parametri sistema
└── shared/                  # Componenti riutilizzabili
```

---

## Flusso di autenticazione

### 1. Login iniziale

```
┌─────────────┐
│   Utente    │
│  inserisce  │
│ credenziali │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────┐
│  LoginComponent                     │
│  - username: string                 │
│  - password: string                 │
└──────┬──────────────────────────────┘
       │ authService.login()
       ▼
┌─────────────────────────────────────┐
│  AuthService                        │
│  POST /api/auth/login               │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│  Backend JWT                        │
│  Valida credenziali                 │
│  → Restituisce token                │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│  AuthService salva token            │
│  - localStorage.setItem()           │
│  - isAuthenticatedSubject.next()    │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│  Router.navigate(['/dashboard'])    │
└─────────────────────────────────────┘
```

### 2. Protezione Rotte

Tutte le rotte tranne `/login` sono protette dall'**AuthGuard**:

```typescript
// app.routes.ts
{
  path: 'dashboard',
  loadComponent: () => import('./features/dashboard/...'),
  canActivate: [authGuard]  // ← Controlla autenticazione
}
```

**Flusso AuthGuard:**
1. Utente naviga verso una rotta protetta
2. AuthGuard verifica `authService.isAuthenticated()`
3. Se **autenticato** → `return true` (permette navigazione)
4. Se **NON autenticato** → `router.navigate(['/login'])` (redirect a login)

### 3. Aggiunta Token alle Richieste

L'**AuthInterceptor** intercetta ogni richiesta HTTP e aggiunge il token JWT:

```typescript
// auth.interceptor.ts
intercept(req, next) {
  const token = authService.getToken();
  
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  
  return next.handle(req);
}
```

### 4. Gestione Scadenza Token

Se il token scade (24 ore):
1. Backend restituisce **401 Unauthorized**
2. AuthInterceptor intercetta l'errore
3. Chiama `authService.logout()`
4. Redirect automatico a `/login`

---

## Flusso operativo principale

### Ciclo di lavoro giornaliero

```
┌──────────────┐
│   LOGIN      │
└──────┬───────┘
       │
       ▼
┌──────────────────────────────────────────────┐
│             DASHBOARD                        │
│  Vista giornaliera:                          │
│  • Arrivi del giorno                         │
│  • Partenze del giorno                       │
│  • Occupazione camere                        │
│  • Camere da pulire                          │
│  • Incassi giornata                          │
└──────┬───────────────────────────────────────┘
       │
       ├──► Arrivi: gestisci check-in
       │    └─► Aggiungi ospiti alla prenotazione
       │        └─► Registra pagamenti
       │
       ├──► Partenze: gestisci check-out
       │    └─► Segna camera DA_PULIRE
       │
       ├──► Camere da pulire
       │    └─► Cambia stato in PULITA
       │
       └──► Planning visuale
            └─► Verifica occupazione prossimi giorni
```

---

## Dettaglio flussi per area funzionale

### 1. Dashboard (Vista Operativa)

**Componente**: `DashboardComponent`  
**Servizio**: `DashboardService`

```
┌─────────────────────────────────────┐
│  DashboardComponent.ngOnInit()      │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│  DashboardService.getDashboard()    │
│  GET /api/dashboard                 │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│  Backend calcola:                   │
│  - arriviOggi                       │
│  - partenzeOggi                     │
│  - camereOccupate                   │
│  - camereDisponibili                │
│  - camereDaPulire                   │
│  - incassiOggi                      │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│  Template mostra statistiche        │
│  + liste arriviDelGiorno            │
│  + liste partenzeDelGiorno          │
└─────────────────────────────────────┘
```

**Azioni utente dalla dashboard:**
- Click su prenotazione → Naviga a dettaglio
- Click su camera da pulire → Cambio stato pulizia
- Link "Vedi tutte" → Lista completa prenotazioni

---

### 2. Planning (Griglia Camere × Giorni)

**Componente**: `PlanningComponent`  
**Servizio**: `DashboardService`

```
┌─────────────────────────────────────┐
│  Utente seleziona periodo           │
│  (settimana / 2 settimane / mese)   │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│  GET /api/dashboard/planning        │
│  ?dataInizio=2026-01-25             │
│  &dataFine=2026-02-01               │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│  Backend restituisce:               │
│  - Lista camere                     │
│  - Prenotazioni nel periodo         │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│  Template renderizza griglia:       │
│  • Asse X: Giorni                   │
│  • Asse Y: Camere                   │
│  • Celle colorate se prenotate      │
│  • Colori per stato prenotazione    │
└─────────────────────────────────────┘
```

**Interazioni:**
- Click su cella vuota → Form nuova prenotazione
- Click su cella occupata → Dettaglio prenotazione
- Frecce navigazione → Cambia periodo

---

### 3. Gestione Prenotazioni

#### 3.1 Lista Prenotazioni

**Componente**: `PrenotazioniListComponent`  
**Servizio**: `PrenotazioneService`

```
┌─────────────────────────────────────┐
│  GET /api/prenotazioni              │
│  ?stato=CONFERMATA                  │
│  &dataCheckInDa=...                 │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│  Tabella con colonne:               │
│  - Camera                           │
│  - Ospite titolare                  │
│  - Check-in / Check-out             │
│  - Stato                            │
│  - Saldo                            │
└──────┬──────────────────────────────┘
       │
       ├──► Click "Visualizza" → Dettaglio
       ├──► Click "Modifica" → Form modifica
       └──► Click "Nuova" → Form creazione
```

#### 3.2 Creazione Prenotazione

**Componente**: `PrenotazioneFormComponent`

```
┌─────────────────────────────────────┐
│  Utente compila form:               │
│  1. Seleziona camera                │
│  2. Inserisce data check-in         │
│  3. Inserisce data check-out        │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│  GET /api/tariffe/calcola           │
│  ?camera=...&checkIn=...&checkOut=..│
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│  Backend calcola prezzo totale      │
│  basato su tariffa e periodo        │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│  Form mostra prezzo calcolato       │
│  (campo readonly)                   │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│  Utente conferma                    │
│  POST /api/prenotazioni             │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│  Backend:                           │
│  1. Verifica disponibilità camera   │
│  2. Crea prenotazione               │
│  3. Stato iniziale: CONFERMATA      │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│  Redirect a dettaglio prenotazione  │
└─────────────────────────────────────┘
```

#### 3.3 Dettaglio Prenotazione

**Componente**: `PrenotazioneDetailComponent`

```
┌─────────────────────────────────────┐
│  GET /api/prenotazioni/{id}         │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│  Visualizza sezioni:                │
│                                     │
│  📋 DATI PRENOTAZIONE               │
│  • Camera, date, stato, prezzo      │
│                                     │
│  👥 OSPITI                          │
│  • Lista ospiti associati           │
│  • Pulsante "Aggiungi ospite"       │
│                                     │
│  💰 PAGAMENTI                       │
│  • Lista pagamenti effettuati       │
│  • Totale pagato / Saldo            │
│  • Pulsante "Registra pagamento"    │
└─────────────────────────────────────┘
```

**Flusso aggiunta ospite:**

```
1. Click "Aggiungi ospite"
   │
   ▼
2. Modale ricerca ospiti esistenti
   │
   ├─► Ospite esistente trovato
   │   └─► POST /api/prenotazioni/{id}/ospiti
   │       { ospiteId: ..., titolare: false }
   │
   └─► Ospite nuovo
       └─► Form nuovo ospite
           └─► POST /api/ospiti
               └─► POST /api/prenotazioni/{id}/ospiti
```

**Flusso registrazione pagamento:**

```
1. Click "Registra pagamento"
   │
   ▼
2. Form pagamento:
   • Importo
   • Metodo pagamento (contanti/carta/bonifico)
   • Data (default: oggi)
   │
   ▼
3. POST /api/prenotazioni/{id}/pagamenti
   │
   ▼
4. Aggiorna saldo visualizzato
```

---

### 4. Gestione Ospiti

**Componente**: `OspitiListComponent`, `OspiteFormComponent`, `OspiteDetailComponent`  
**Servizio**: `OspiteService`

#### 4.1 Creazione Nuovo Ospite

```
┌─────────────────────────────────────┐
│  Utente compila form schedina:     │
│  • Cognome, Nome *                 │
│  • Sesso *, Data nascita *         │
│  • Luogo nascita * (autocomplete)  │
│    (comune IT o stato estero)      │
│  • Cittadinanza *                  │
│  • Tipo documento *                │
│  • Numero documento *              │
│  • Luogo rilascio *                │
│    (comune IT o stato estero)      │
│  • Telefono, Email (opzionali)     │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│  VALIDAZIONE FRONTEND               │
│  ✓ Tutti i campi * obbligatori     │
│  ✓ Luogo nascita: deve essere      │
│    selezionato un comune OPPURE    │
│    uno stato dalla lista           │
│  ✓ Luogo rilascio: deve essere     │
│    selezionato un comune OPPURE    │
│    uno stato dalla lista           │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│  GET /api/ospiti/duplicati          │
│  ?cognome=...&nome=...&documento=...│
└──────┬──────────────────────────────┘
       │
       ├──► Duplicati trovati
       │    └─► Mostra avviso
       │        "Esiste già un ospite simile"
       │        ├─► Usa esistente
       │        └─► Crea comunque
       │
       └──► Nessun duplicato
            └─► POST /api/ospiti
```

**IMPORTANTE - Campi Luogo Nascita e Luogo Rilascio**:
- Non sono semplici campi di testo libero
- L'utente DEVE selezionare dalla lista autocomplete
- Può essere un **comune italiano** (es. "Milano (MI)") OPPURE uno **stato estero** (es. "Francia")
- La validazione frontend impedisce il submit se non è stata fatta una selezione dalla lista
- Il backend riceve `comuneNascitaId` o `statoNascitaId` (mai entrambi)

#### 4.2 Ricerca Ospiti

```
┌─────────────────────────────────────┐
│  Utente digita in campo ricerca     │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│  GET /api/ospiti/search             │
│  ?q=...                             │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│  Backend cerca in:                  │
│  • Cognome                          │
│  • Nome                             │
│  • Numero documento                 │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│  Mostra risultati                   │
└─────────────────────────────────────┘
```

---

### 5. Gestione Camere

**Componente**: `CamereListComponent`  
**Servizio**: `CameraService`

#### 5.1 Cambio Stato Pulizia

```
┌─────────────────────────────────────┐
│  Dashboard mostra:                  │
│  "5 camere da pulire"               │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│  Click su camera                    │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│  Pulsante "Segna come pulita"       │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│  PUT /api/camere/{id}/stato-pulizia │
│  { stato: "PULITA" }                │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│  Aggiorna UI                        │
│  Contatore "Da pulire" decrementato │
└─────────────────────────────────────┘
```

#### 5.2 Verifica Disponibilità

```
┌─────────────────────────────────────┐
│  Form nuova prenotazione            │
│  Utente seleziona date              │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│  GET /api/camere/disponibili        │
│  ?checkIn=...&checkOut=...          │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│  Backend verifica:                  │
│  SELECT * FROM camera               │
│  WHERE id NOT IN (                  │
│    SELECT camera_id                 │
│    FROM prenotazione                │
│    WHERE date si sovrappongono      │
│  )                                  │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│  Dropdown mostra solo camere        │
│  disponibili nel periodo            │
└─────────────────────────────────────┘
```

---

### 6. Gestione Tariffe

**Componente**: `TariffeListComponent`, `PeriodiListComponent`  
**Servizio**: `TariffaService`, `PeriodoTariffarioService`

#### 6.1 Struttura Tariffe

```
┌────────────────────────────────────────────┐
│  Griglia Tariffe                           │
│                                            │
│          │ Gen-Feb │ Mar-Apr │ Mag-Ago    │
│  ────────┼─────────┼─────────┼──────────  │
│  Singola │  50€    │  60€    │  80€       │
│  Doppia  │  70€    │  80€    │  100€      │
│  Suite   │  120€   │  140€   │  180€      │
└────────────────────────────────────────────┘
```

Ogni cella rappresenta una **Tariffa**:
- `tipologiaCamera` (Singola, Doppia, Suite)
- `periodoTariffario` (Gen-Feb, Mar-Apr, Mag-Ago)
- `prezzo` (50, 70, 120, etc.)

#### 6.2 Calcolo Prezzo Prenotazione

```
┌─────────────────────────────────────┐
│  Dati prenotazione:                 │
│  • Camera: Doppia (id=5)            │
│  • Check-in: 2026-05-10             │
│  • Check-out: 2026-05-15            │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│  GET /api/tariffe/calcola           │
│  ?camera=5&checkIn=...&checkOut=... │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│  Backend:                           │
│  1. Trova tipologia camera (Doppia) │
│  2. Trova periodo attivo            │
│     (Mag-Ago copre 2026-05-10)      │
│  3. Trova tariffa                   │
│     (Doppia × Mag-Ago = 100€)       │
│  4. Calcola notti (5 giorni = 5)    │
│  5. Prezzo = 100€ × 5 = 500€        │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│  Restituisce: { prezzoTotale: 500 } │
└─────────────────────────────────────┘
```

---

### 7. Configurazione Sistema

**Componente**: `ConfigurazioneComponent`  
**Servizio**: `ConfigurazioneService`

```
┌─────────────────────────────────────┐
│  GET /api/configurazione            │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│  Form parametri:                    │
│  • Orario check-in: 14:00           │
│  • Orario check-out: 10:00          │
│  • Durata minima: 1 notte           │
│  • Durata massima: 30 notti         │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│  Utente modifica valori             │
│  Click "Salva"                      │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│  PUT /api/configurazione            │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│  Toast successo                     │
│  "Configurazione salvata"           │
└─────────────────────────────────────┘
```

---

## Pattern tecnici utilizzati

### 1. Lazy Loading

Ogni area funzionale è caricata **on-demand** per ridurre il bundle iniziale:

```typescript
// app.routes.ts
{
  path: 'prenotazioni',
  loadComponent: () => import('./features/prenotazioni/...')
  // ↑ Caricato solo quando utente naviga a /prenotazioni
}
```

### 2. Reactive Programming (RxJS)

Uso estensivo di **Observable** per gestire flussi asincroni:

```typescript
// dashboard.component.ts
ngOnInit() {
  this.dashboardService.getDashboard().subscribe({
    next: (data) => this.dashboard = data,
    error: (err) => this.error = err.message
  });
}
```

### 3. BehaviorSubject per State Sharing

Condivisione stato autenticazione tra componenti:

```typescript
// auth.service.ts
private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

// app.component.ts (menu)
isAuthenticated$ = this.authService.isAuthenticated$;
```

### 4. Standalone Components

Nessun NgModule, ogni componente dichiara dipendenze:

```typescript
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  // ↑ Import espliciti solo di ciò che serve
  ...
})
```

### 5. Interceptor HTTP

Manipolazione centralizzata di richieste/risposte:

```typescript
// auth.interceptor.ts
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(AuthService).getToken();
  
  if (token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }
  
  return next(req).pipe(
    catchError(error => {
      if (error.status === 401) {
        inject(AuthService).logout();
      }
      return throwError(() => error);
    })
  );
};
```

### 6. Guard Funzionali

Protezione rotte con functional guard (Angular 17+):

```typescript
// auth.guard.ts
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAuthenticated() 
    ? true 
    : router.createUrlTree(['/login']);
};
```

---

## Stati delle Entità

### Stati Prenotazione

```
CONFERMATA → IN_CORSO → COMPLETATA
     ↓
 CANCELLATA
```

- **CONFERMATA**: Prenotazione creata, in attesa del check-in
- **IN_CORSO**: Check-in effettuato, ospite presente
- **COMPLETATA**: Check-out effettuato
- **CANCELLATA**: Prenotazione annullata

### Stati Pulizia Camera

```
PULITA ⇄ DA_PULIRE
```

Cambiamento automatico:
- Check-out → Camera diventa **DA_PULIRE**
- Operatore segna come pulita → **PULITA**

---

## Gestione Errori

### Codici HTTP

| Codice | Significato | Azione Frontend |
|--------|-------------|-----------------|
| 400 | Validazione fallita | Mostra errori nei campi form |
| 401 | Token scaduto | Logout + redirect a login |
| 403 | Accesso negato | Messaggio errore |
| 404 | Risorsa non trovata | Messaggio + redirect a lista |
| 409 | Conflitto (es. camera occupata) | Messaggio specifico |
| 500 | Errore server | Messaggio generico |

### Feedback Utente

```typescript
// Esempio toast/snackbar
onSave() {
  this.prenotazioneService.create(this.form.value).subscribe({
    next: () => {
      this.showToast('Prenotazione salvata', 'success');
      this.router.navigate(['/prenotazioni']);
    },
    error: (err) => {
      this.showToast(err.error.message, 'error');
    }
  });
}
```

---

## Riepilogo Menu Navigazione

```
┌─────────────────────────────────────┐
│  🏠 Dashboard                        │ ← Vista operativa giornaliera
├─────────────────────────────────────┤
│  📅 Planning                         │ ← Griglia camere × giorni
├─────────────────────────────────────┤
│  📋 Prenotazioni                     │ ← CRUD prenotazioni
├─────────────────────────────────────┤
│  👥 Ospiti                           │ ← Anagrafica schedina alloggiati
├─────────────────────────────────────┤
│  🚪 Camere                           │ ← Gestione camere
├─────────────────────────────────────┤
│  📐 Tipologie                        │ ← Tipologie camera
├─────────────────────────────────────┤
│  💰 Tariffe                          │ ← Configurazione tariffe
├─────────────────────────────────────┤
│  📆 Periodi                          │ ← Periodi tariffari
├─────────────────────────────────────┤
│  ⚙️ Configurazione                   │ ← Parametri sistema
└─────────────────────────────────────┘
```

---

## Scenario d'Uso Completo: Nuova Prenotazione

### Flusso end-to-end

```
1. 🔐 LOGIN
   Operatore accede con credenziali

2. 📊 DASHBOARD
   Vede occupazione attuale

3. 🆕 NUOVA PRENOTAZIONE
   Click "Nuova prenotazione"
   ├─► Seleziona camera: Doppia 101
   ├─► Check-in: 2026-01-25
   ├─► Check-out: 2026-01-28
   └─► Prezzo calcolato automaticamente: 210€

4. ✅ SALVA PRENOTAZIONE
   Stato: CONFERMATA

5. 👥 AGGIUNGI OSPITE
   ├─► Cerca "Mario Rossi"
   ├─► Non trovato → Crea nuovo
   ├─► Compila schedina alloggiati
   └─► Segna come titolare

6. 💰 REGISTRA CAPARRA
   ├─► Importo: 50€
   ├─► Metodo: Carta di credito
   └─► Saldo rimanente: 160€

7. 📅 CHECK-IN (25/01/2026)
   ├─► Cambia stato: IN_CORSO
   └─► Consegna chiavi

8. 💳 SALDO ALLA PARTENZA
   ├─► Registra pagamento: 160€
   └─► Saldo: 0€

9. ✈️ CHECK-OUT (28/01/2026)
   ├─► Cambia stato: COMPLETATA
   └─► Camera 101 → DA_PULIRE

10. 🧹 PULIZIA
    ├─► Operatore pulisce camera
    └─► Segna: PULITA
```

---

## Conclusione

Questo gestionale segue un **approccio moderno** con:
- ✅ Architettura scalabile (standalone components)
- ✅ Sicurezza (JWT, guard, interceptor)
- ✅ UX fluida (lazy loading, feedback immediato)
- ✅ Manutenibilità (separazione layer, servizi dedicati)

L'operatore ha una **vista operativa chiara** dalla dashboard e può gestire l'intero ciclo di vita di una prenotazione con pochi click.
