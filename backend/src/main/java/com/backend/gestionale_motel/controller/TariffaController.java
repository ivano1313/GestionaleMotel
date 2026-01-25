package com.backend.gestionale_motel.controller;

import com.backend.gestionale_motel.dto.TariffaDTO;
import com.backend.gestionale_motel.service.TariffaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * Controller REST per la gestione delle tariffe
 */
@RestController
@RequestMapping("/api/tariffe")
@RequiredArgsConstructor
public class TariffaController {

    private final TariffaService tariffaService;

    /**
     * Recupera tutte le tariffe
     * @return lista di TariffaDTO
     */
    @GetMapping
    public ResponseEntity<List<TariffaDTO>> findAll() {
        List<TariffaDTO> tariffe = tariffaService.findAll();
        return ResponseEntity.ok(tariffe);
    }

    /**
     * Recupera una tariffa per ID
     * @param id identificativo della tariffa
     * @return la tariffa richiesta
     */
    @GetMapping("/{id}")
    public ResponseEntity<TariffaDTO> findById(@PathVariable Long id) {
        TariffaDTO tariffa = tariffaService.findById(id);
        return ResponseEntity.ok(tariffa);
    }

    /**
     * Cerca una tariffa per tipologia e periodo tariffario
     * @param tipologiaId identificativo della tipologia camera
     * @param periodoId identificativo del periodo tariffario
     * @return la tariffa corrispondente
     */
    @GetMapping("/cerca")
    public ResponseEntity<TariffaDTO> findByTipologiaAndPeriodo(
            @RequestParam Long tipologiaId,
            @RequestParam Long periodoId) {
        TariffaDTO tariffa = tariffaService.findByTipologiaAndPeriodo(tipologiaId, periodoId);
        return ResponseEntity.ok(tariffa);
    }

    /**
     * Calcola il prezzo totale di un soggiorno
     * @param tipologiaId identificativo della tipologia camera
     * @param checkIn data di check-in (formato ISO: yyyy-MM-dd)
     * @param checkOut data di check-out (formato ISO: yyyy-MM-dd)
     * @return il prezzo totale del soggiorno
     */
    @GetMapping("/calcola-prezzo")
    public ResponseEntity<BigDecimal> calcolaPrezzoSoggiorno(
            @RequestParam Long tipologiaId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkIn,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOut) {
        BigDecimal prezzo = tariffaService.calcolaPrezzoSoggiorno(tipologiaId, checkIn, checkOut);
        return ResponseEntity.ok(prezzo);
    }

    /**
     * Crea una nuova tariffa
     * @param dto dati della tariffa da creare
     * @return la tariffa creata
     */
    @PostMapping
    public ResponseEntity<TariffaDTO> create(@Valid @RequestBody TariffaDTO dto) {
        TariffaDTO created = tariffaService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /**
     * Aggiorna una tariffa esistente
     * @param id identificativo della tariffa
     * @param dto nuovi dati della tariffa
     * @return la tariffa aggiornata
     */
    @PutMapping("/{id}")
    public ResponseEntity<TariffaDTO> update(
            @PathVariable Long id,
            @Valid @RequestBody TariffaDTO dto) {
        TariffaDTO updated = tariffaService.update(id, dto);
        return ResponseEntity.ok(updated);
    }

    /**
     * Elimina una tariffa (eliminazione fisica)
     * @param id identificativo della tariffa da eliminare
     * @return risposta senza contenuto
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        tariffaService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
