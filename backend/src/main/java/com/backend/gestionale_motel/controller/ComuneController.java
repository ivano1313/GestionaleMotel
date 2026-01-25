package com.backend.gestionale_motel.controller;

import com.backend.gestionale_motel.dto.ComuneDTO;
import com.backend.gestionale_motel.service.ComuneService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller REST per la gestione dei Comuni (tabella lookup - sola lettura)
 */
@RestController
@RequestMapping("/api/comuni")
@RequiredArgsConstructor
public class ComuneController {

    private final ComuneService comuneService;

    /**
     * Recupera tutti i comuni italiani
     * @return lista completa di comuni
     */
    @GetMapping
    public ResponseEntity<List<ComuneDTO>> findAll() {
        List<ComuneDTO> comuni = comuneService.findAll();
        return ResponseEntity.ok(comuni);
    }

    /**
     * Ricerca comuni per nome (ricerca parziale case-insensitive)
     * @param nome termine di ricerca nel nome del comune
     * @return lista di comuni che contengono il termine nel nome
     */
    @GetMapping("/search")
    public ResponseEntity<List<ComuneDTO>> searchByNome(@RequestParam String nome) {
        List<ComuneDTO> comuni = comuneService.searchByNome(nome);
        return ResponseEntity.ok(comuni);
    }

    /**
     * Filtra comuni per provincia
     * @param provincia sigla della provincia (es: RM, MI, TO)
     * @return lista di comuni della provincia specificata
     */
    @GetMapping("/provincia/{provincia}")
    public ResponseEntity<List<ComuneDTO>> findByProvincia(@PathVariable String provincia) {
        List<ComuneDTO> comuni = comuneService.findByProvincia(provincia);
        return ResponseEntity.ok(comuni);
    }
}
