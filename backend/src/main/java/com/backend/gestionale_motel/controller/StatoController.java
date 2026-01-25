package com.backend.gestionale_motel.controller;

import com.backend.gestionale_motel.dto.StatoDTO;
import com.backend.gestionale_motel.service.StatoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller REST per la gestione degli Stati/Nazioni (tabella lookup - sola lettura)
 */
@RestController
@RequestMapping("/api/stati")
@RequiredArgsConstructor
public class StatoController {

    private final StatoService statoService;

    /**
     * Recupera tutti gli stati/nazioni
     * @return lista completa di stati
     */
    @GetMapping
    public ResponseEntity<List<StatoDTO>> findAll() {
        List<StatoDTO> stati = statoService.findAll();
        return ResponseEntity.ok(stati);
    }

    /**
     * Ricerca stati per nome (ricerca parziale case-insensitive)
     * @param nome termine di ricerca nel nome dello stato
     * @return lista di stati che contengono il termine nel nome
     */
    @GetMapping("/search")
    public ResponseEntity<List<StatoDTO>> searchByNome(@RequestParam String nome) {
        List<StatoDTO> stati = statoService.searchByNome(nome);
        return ResponseEntity.ok(stati);
    }
}
