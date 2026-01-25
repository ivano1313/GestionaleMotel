package com.backend.gestionale_motel.controller;

import com.backend.gestionale_motel.dto.PeriodoTariffarioDTO;
import com.backend.gestionale_motel.service.PeriodoTariffarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/**
 * Controller REST per la gestione dei periodi tariffari
 */
@RestController
@RequestMapping("/api/periodi")
@RequiredArgsConstructor
public class PeriodoTariffarioController {

    private final PeriodoTariffarioService periodoTariffarioService;

    /**
     * Recupera tutti i periodi tariffari attivi
     * @return lista di PeriodoTariffarioDTO
     */
    @GetMapping
    public ResponseEntity<List<PeriodoTariffarioDTO>> findAll() {
        List<PeriodoTariffarioDTO> periodi = periodoTariffarioService.findAll();
        return ResponseEntity.ok(periodi);
    }

    /**
     * Recupera un periodo tariffario per ID
     * @param id identificativo del periodo
     * @return il periodo richiesto
     */
    @GetMapping("/{id}")
    public ResponseEntity<PeriodoTariffarioDTO> findById(@PathVariable Long id) {
        PeriodoTariffarioDTO periodo = periodoTariffarioService.findById(id);
        return ResponseEntity.ok(periodo);
    }

    /**
     * Trova il periodo tariffario valido per una data specifica
     * @param data data per cui cercare il periodo (formato ISO: yyyy-MM-dd)
     * @return il periodo tariffario valido per la data
     */
    @GetMapping("/per-data")
    public ResponseEntity<PeriodoTariffarioDTO> findPeriodoPerData(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate data) {
        PeriodoTariffarioDTO periodo = periodoTariffarioService.findPeriodoPerData(data);
        return ResponseEntity.ok(periodo);
    }

    /**
     * Crea un nuovo periodo tariffario
     * @param dto dati del periodo da creare
     * @return il periodo creato
     */
    @PostMapping
    public ResponseEntity<PeriodoTariffarioDTO> create(@Valid @RequestBody PeriodoTariffarioDTO dto) {
        // Validazione: dataFine deve essere dopo dataInizio
        if (dto.getDataFine() != null && dto.getDataInizio() != null
                && !dto.getDataFine().isAfter(dto.getDataInizio())) {
            throw new IllegalArgumentException("La data di fine deve essere successiva alla data di inizio");
        }

        PeriodoTariffarioDTO created = periodoTariffarioService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /**
     * Aggiorna un periodo tariffario esistente
     * @param id identificativo del periodo
     * @param dto nuovi dati del periodo
     * @return il periodo aggiornato
     */
    @PutMapping("/{id}")
    public ResponseEntity<PeriodoTariffarioDTO> update(
            @PathVariable Long id,
            @Valid @RequestBody PeriodoTariffarioDTO dto) {
        // Validazione: dataFine deve essere dopo dataInizio
        if (dto.getDataFine() != null && dto.getDataInizio() != null
                && !dto.getDataFine().isAfter(dto.getDataInizio())) {
            throw new IllegalArgumentException("La data di fine deve essere successiva alla data di inizio");
        }

        PeriodoTariffarioDTO updated = periodoTariffarioService.update(id, dto);
        return ResponseEntity.ok(updated);
    }

    /**
     * Disattiva un periodo tariffario (soft delete)
     * @param id identificativo del periodo da disattivare
     * @return risposta senza contenuto
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        periodoTariffarioService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
