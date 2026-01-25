### 2.1 UtenteRepository
* `findByUsername(String username)`
* `existsByUsername(String username)`
* `findByAttivo(boolean attivo)`

### 2.2 TipologiaCameraRepository
* `findByAttivo(boolean attivo)`
* `findByNome(String nome)`
* `existsByNome(String nome)`

### 2.3 CameraRepository
* `findByTipologia(TipologiaCamera tipologia)`
* `findByStatoPulizia(StatoPulizia stato)`
* `findByNumero(String numero)`
* `findCamereDisponibili(LocalDate checkIn, LocalDate checkOut)`

### 2.4 PeriodoTariffarioRepository
* `findByAttivo(boolean attivo)`
* `findByDataInizioBetween(LocalDate da, LocalDate a)`
* `findPeriodoPerData(LocalDate data)`

### 2.5 TariffaRepository
* `findByTipologiaAndPeriodo(TipologiaCamera t, PeriodoTariffario p)`
* `findByTipologia(TipologiaCamera tipologia)`
* `findByPeriodo(PeriodoTariffario periodo)`

### 2.6 MetodoPagamentoRepository
* `findByAttivo(boolean attivo)`
* `findByNome(String nome)`

### 2.7 OspiteRepository
* `findByNumeroDocumento(String numero)`
* `findByCognomeContainingIgnoreCase(String cognome)`
* `findByNomeAndCognome(String nome, String cognome)`
* `findOspitiSimili(String nome, String cognome, String documento)`

### 2.8 PrenotazioneRepository
* `findByStato(StatoPrenotazione stato)`
* `findByCamera(Camera camera)`
* `findArriviDelGiorno(LocalDate data)`
* `findPartenzeDelGiorno(LocalDate data)`
* `findPrenotazioniAttive(LocalDate data)`
* `existsSovrapposizione(Camera c, LocalDate in, LocalDate out)`
* `findByDataCheckInBetween(LocalDate da, LocalDate a)`

### 2.9 OspitePrenotazioneRepository
* `findByPrenotazione(Prenotazione prenotazione)`
* `findByOspite(Ospite ospite)`
* `findTitolare(Prenotazione prenotazione)`
* `countByPrenotazione(Prenotazione prenotazione)`

### 2.10 PagamentoRepository
* `findByPrenotazione(Prenotazione prenotazione)`
* `sumImportoByPrenotazione(Prenotazione prenotazione)`
* `findByDataPagamentoBetween(LocalDateTime da, LocalDateTime a)`

### 2.11 ConfigurazioneRepository
* `findSingleton()`

### 2.12 Repository Lookup
**ComuneRepository**
* `findByNomeContaining()`
* `findByProvincia()`

**StatoRepository**
* `findByCodice()`
* `findByNomeContaining()`

**TipoDocumentoRepository**
* `findByCodice()`
* `findAll()`