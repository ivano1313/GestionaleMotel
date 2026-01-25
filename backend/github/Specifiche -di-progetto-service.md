### 3.1 UtenteService
* `findByUsername(String username)`
* `updateUltimoAccesso(Long id)`
* `cambiaPassword(Long id, String nuovaPassword)`
* `disattivaUtente(Long id)`

### 3.2 TipologiaCameraService
* `findAll()`
* `create(TipologiaCameraDTO dto)`
* `update(Long id, TipologiaCameraDTO dto)`
* `delete(Long id)`

### 3.3 CameraService
* `findAll()`
* `findDisponibili(LocalDate checkIn, LocalDate checkOut)`
* `findDaPulire()`
* `cambiaStatoPulizia(Long id, StatoPulizia stato)`
* `create(CameraDTO dto)`
* `update(Long id, CameraDTO dto)`

### 3.4 PeriodoTariffarioService
* `findAll()`
* `findPeriodoPerData(LocalDate data)`
* `create(PeriodoTariffarioDTO dto)`
* `update(Long id, PeriodoTariffarioDTO dto)`
* `delete(Long id)`

### 3.5 TariffaService
* `findByTipologiaAndPeriodo(Long tipologiaId, Long periodoId)`
* `calcolaPrezzoSoggiorno(Long tipologiaId, LocalDate checkIn, LocalDate checkOut)`
* `create(TariffaDTO dto)`
* `update(Long id, TariffaDTO dto)`
* `delete(Long id)`

### 3.6 MetodoPagamentoService
* `findAll()`
* `create(MetodoPagamentoDTO dto)`
* `update(Long id, MetodoPagamentoDTO dto)`
* `delete(Long id)`

### 3.7 OspiteService
* `findAll()`
* `findById(Long id)`
* `search(String termine)`
* `findDuplicati(String nome, String cognome, String documento)`
* `create(OspiteDTO dto)`
* `update(Long id, OspiteDTO dto)`

### 3.8 PrenotazioneService
* `findAll()`
* `findById(Long id)`
* `findArriviOggi()`
* `findPartenzeOggi()`
* `findAttive()`
* `create(PrenotazioneDTO dto)`
* `cambiaStato(Long id, StatoPrenotazione stato)`
* `verificaDisponibilita(Long cameraId, LocalDate checkIn, LocalDate checkOut)`
* `calcolaSaldoDovuto(Long id)`

### 3.9 OspitePrenotazioneService
* `findByPrenotazione(Long prenotazioneId)`
* `addOspite(Long prenotazioneId, Long ospiteId, boolean titolare)`
* `removeOspite(Long prenotazioneId, Long ospiteId)`
* `setTitolare(Long prenotazioneId, Long ospiteId)`

### 3.10 PagamentoService
* `findByPrenotazione(Long prenotazioneId)`
* `getTotalePagato(Long prenotazioneId)`
* `getSaldoDovuto(Long prenotazioneId)`
* `create(PagamentoDTO dto)`

### 3.11 ConfigurazioneService
* `get()`
* `update(ConfigurazioneDTO dto)`

### 3.12 DashboardService
* `getDashboard()`
* `getPlanning(LocalDate da, LocalDate a)`