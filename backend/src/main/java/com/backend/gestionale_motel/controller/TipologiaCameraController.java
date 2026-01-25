package com.backend.gestionale_motel.controller;

import com.backend.gestionale_motel.dto.TipologiaCameraDTO;
import com.backend.gestionale_motel.service.TipologiaCameraService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller REST per la gestione delle tipologie di camera
 */
@RestController
@RequestMapping("/api/tipologie")
@RequiredArgsConstructor
public class TipologiaCameraController {

    private final TipologiaCameraService tipologiaCameraService;

    /**
     * Recupera tutte le tipologie di camera attive
     * @return lista di TipologiaCameraDTO
     */
    @GetMapping
    public ResponseEntity<List<TipologiaCameraDTO>> findAll() {
        List<TipologiaCameraDTO> tipologie = tipologiaCameraService.findAll();
        return ResponseEntity.ok(tipologie);
    }

    /**
     * Crea una nuova tipologia di camera
     * @param dto dati della tipologia da creare
     * @return la tipologia creata
     */
    @PostMapping
    public ResponseEntity<TipologiaCameraDTO> create(@Valid @RequestBody TipologiaCameraDTO dto) {
        TipologiaCameraDTO created = tipologiaCameraService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /**
     * Aggiorna una tipologia di camera esistente
     * @param id identificativo della tipologia
     * @param dto nuovi dati della tipologia
     * @return la tipologia aggiornata
     */
    @PutMapping("/{id}")
    public ResponseEntity<TipologiaCameraDTO> update(
            @PathVariable Long id,
            @Valid @RequestBody TipologiaCameraDTO dto) {
        TipologiaCameraDTO updated = tipologiaCameraService.update(id, dto);
        return ResponseEntity.ok(updated);
    }

    /**
     * Disattiva una tipologia di camera (soft delete)
     * @param id identificativo della tipologia da disattivare
     * @return risposta senza contenuto
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        tipologiaCameraService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
