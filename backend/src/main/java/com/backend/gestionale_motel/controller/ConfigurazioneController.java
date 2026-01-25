package com.backend.gestionale_motel.controller;

import com.backend.gestionale_motel.dto.ConfigurazioneDTO;
import com.backend.gestionale_motel.service.ConfigurazioneService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controller REST per la gestione della configurazione del sistema
 * La configurazione è un singleton (un solo record nel sistema)
 */
@RestController
@RequestMapping("/api/configurazione")
@RequiredArgsConstructor
public class ConfigurazioneController {

    private final ConfigurazioneService configurazioneService;

    /**
     * Recupera la configurazione del sistema
     * @return la configurazione singleton
     */
    @GetMapping
    public ResponseEntity<ConfigurazioneDTO> get() {
        ConfigurazioneDTO configurazione = configurazioneService.get();
        return ResponseEntity.ok(configurazione);
    }

    /**
     * Aggiorna la configurazione del sistema
     * La configurazione contiene:
     * - Orari di check-in e check-out
     * - Durata minima e massima del soggiorno
     * @param dto nuovi dati della configurazione
     * @return la configurazione aggiornata
     */
    @PutMapping
    public ResponseEntity<ConfigurazioneDTO> update(@Valid @RequestBody ConfigurazioneDTO dto) {
        // Validazione custom: durata massima deve essere >= durata minima
        if (dto.getDurataMassima() < dto.getDurataMinima()) {
            throw new IllegalArgumentException("La durata massima deve essere maggiore o uguale alla durata minima");
        }

        ConfigurazioneDTO updated = configurazioneService.update(dto);
        return ResponseEntity.ok(updated);
    }
}
