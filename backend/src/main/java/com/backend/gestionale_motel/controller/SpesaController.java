package com.backend.gestionale_motel.controller;

import com.backend.gestionale_motel.dto.SpesaDTO;
import com.backend.gestionale_motel.service.SpesaService;
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
 * Controller REST per la gestione delle spese
 */
@RestController
@RequestMapping("/api/spese")
@RequiredArgsConstructor
public class SpesaController {

    private final SpesaService spesaService;

    /**
     * Recupera tutte le spese con filtri opzionali
     * @param categoriaId ID categoria (opzionale)
     * @param da data inizio (opzionale)
     * @param a data fine (opzionale)
     * @return lista di SpesaDTO
     */
    @GetMapping
    public ResponseEntity<List<SpesaDTO>> findAll(
            @RequestParam(required = false) Long categoriaId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate da,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate a) {
        List<SpesaDTO> spese = spesaService.findAll(categoriaId, da, a);
        return ResponseEntity.ok(spese);
    }

    /**
     * Recupera una spesa per ID
     * @param id identificativo della spesa
     * @return la spesa richiesta
     */
    @GetMapping("/{id}")
    public ResponseEntity<SpesaDTO> findById(@PathVariable Long id) {
        SpesaDTO spesa = spesaService.findById(id);
        return ResponseEntity.ok(spesa);
    }

    /**
     * Crea una nuova spesa
     * @param dto dati della spesa da creare
     * @return la spesa creata
     */
    @PostMapping
    public ResponseEntity<SpesaDTO> create(@Valid @RequestBody SpesaDTO dto) {
        SpesaDTO created = spesaService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /**
     * Aggiorna una spesa esistente
     * @param id identificativo della spesa
     * @param dto nuovi dati della spesa
     * @return la spesa aggiornata
     */
    @PutMapping("/{id}")
    public ResponseEntity<SpesaDTO> update(
            @PathVariable Long id,
            @Valid @RequestBody SpesaDTO dto) {
        SpesaDTO updated = spesaService.update(id, dto);
        return ResponseEntity.ok(updated);
    }

    /**
     * Elimina una spesa (soft delete)
     * @param id identificativo della spesa da eliminare
     * @return risposta senza contenuto
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        spesaService.delete(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Calcola il totale delle spese in un periodo
     * @param da data inizio (obbligatoria)
     * @param a data fine (obbligatoria)
     * @return totale del periodo
     */
    @GetMapping("/totale")
    public ResponseEntity<BigDecimal> getTotale(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate da,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate a) {
        BigDecimal totale = spesaService.getTotale(da, a);
        return ResponseEntity.ok(totale);
    }
}
