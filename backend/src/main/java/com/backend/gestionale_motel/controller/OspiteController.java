package com.backend.gestionale_motel.controller;

import com.backend.gestionale_motel.dto.OspiteDTO;
import com.backend.gestionale_motel.service.OspiteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller REST per la gestione degli ospiti
 */
@RestController
@RequestMapping("/api/ospiti")
@RequiredArgsConstructor
public class OspiteController {

    private final OspiteService ospiteService;

    /**
     * Recupera tutti gli ospiti
     * @return lista di OspiteDTO
     */
    @GetMapping
    public ResponseEntity<List<OspiteDTO>> findAll() {
        List<OspiteDTO> ospiti = ospiteService.findAll();
        return ResponseEntity.ok(ospiti);
    }

    /**
     * Recupera un ospite per ID
     * @param id identificativo dell'ospite
     * @return l'ospite richiesto
     */
    @GetMapping("/{id}")
    public ResponseEntity<OspiteDTO> findById(@PathVariable Long id) {
        OspiteDTO ospite = ospiteService.findById(id);
        return ResponseEntity.ok(ospite);
    }

    /**
     * Ricerca ospiti per termine (nome, cognome o numero documento)
     * @param termine termine di ricerca
     * @return lista di ospiti che corrispondono al termine
     */
    @GetMapping("/search")
    public ResponseEntity<List<OspiteDTO>> search(@RequestParam String termine) {
        List<OspiteDTO> ospiti = ospiteService.search(termine);
        return ResponseEntity.ok(ospiti);
    }

    /**
     * Trova ospiti duplicati o simili per evitare inserimenti duplicati
     * @param nome nome dell'ospite
     * @param cognome cognome dell'ospite
     * @param documento numero di documento
     * @return lista di ospiti simili trovati
     */
    @GetMapping("/duplicati")
    public ResponseEntity<List<OspiteDTO>> findDuplicati(
            @RequestParam(required = false) String nome,
            @RequestParam(required = false) String cognome,
            @RequestParam(required = false) String documento) {
        List<OspiteDTO> ospiti = ospiteService.findDuplicati(nome, cognome, documento);
        return ResponseEntity.ok(ospiti);
    }

    /**
     * Crea un nuovo ospite
     * @param dto dati dell'ospite da creare
     * @return l'ospite creato
     */
    @PostMapping
    public ResponseEntity<OspiteDTO> create(@Valid @RequestBody OspiteDTO dto) {
        OspiteDTO created = ospiteService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /**
     * Aggiorna un ospite esistente
     * @param id identificativo dell'ospite
     * @param dto nuovi dati dell'ospite
     * @return l'ospite aggiornato
     */
    @PutMapping("/{id}")
    public ResponseEntity<OspiteDTO> update(
            @PathVariable Long id,
            @Valid @RequestBody OspiteDTO dto) {
        OspiteDTO updated = ospiteService.update(id, dto);
        return ResponseEntity.ok(updated);
    }
}
