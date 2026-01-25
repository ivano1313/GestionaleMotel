package com.backend.gestionale_motel.controller;

import com.backend.gestionale_motel.dto.AddOspiteRequest;
import com.backend.gestionale_motel.dto.OspitePrenotazioneDTO;
import com.backend.gestionale_motel.service.OspitePrenotazioneService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller REST per la gestione della relazione Ospite-Prenotazione
 */
@RestController
@RequestMapping("/api/prenotazioni/{prenotazioneId}/ospiti")
@RequiredArgsConstructor
public class OspitePrenotazioneController {

    private final OspitePrenotazioneService ospitePrenotazioneService;

    /**
     * Recupera tutti gli ospiti associati a una prenotazione
     * @param prenotazioneId identificativo della prenotazione
     * @return lista di ospiti associati
     */
    @GetMapping
    public ResponseEntity<List<OspitePrenotazioneDTO>> findByPrenotazione(@PathVariable Long prenotazioneId) {
        List<OspitePrenotazioneDTO> ospiti = ospitePrenotazioneService.findByPrenotazione(prenotazioneId);
        return ResponseEntity.ok(ospiti);
    }

    /**
     * Aggiunge un ospite a una prenotazione
     * Se l'ospite è marcato come titolare, rimuove automaticamente il flag dagli altri
     * @param prenotazioneId identificativo della prenotazione
     * @param request dati dell'ospite da aggiungere (ospiteId e flag titolare)
     * @return la relazione ospite-prenotazione creata
     */
    @PostMapping
    public ResponseEntity<OspitePrenotazioneDTO> addOspite(
            @PathVariable Long prenotazioneId,
            @Valid @RequestBody AddOspiteRequest request) {
        OspitePrenotazioneDTO created = ospitePrenotazioneService.addOspite(
                prenotazioneId,
                request.getOspiteId(),
                request.getTitolare() != null ? request.getTitolare() : false
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /**
     * Rimuove un ospite da una prenotazione
     * @param prenotazioneId identificativo della prenotazione
     * @param ospiteId identificativo dell'ospite da rimuovere
     * @return risposta senza contenuto
     */
    @DeleteMapping("/{ospiteId}")
    public ResponseEntity<Void> removeOspite(
            @PathVariable Long prenotazioneId,
            @PathVariable Long ospiteId) {
        ospitePrenotazioneService.removeOspite(prenotazioneId, ospiteId);
        return ResponseEntity.noContent().build();
    }

    /**
     * Imposta un ospite come titolare della prenotazione
     * Rimuove automaticamente il flag titolare dagli altri ospiti
     * @param prenotazioneId identificativo della prenotazione
     * @param ospiteId identificativo dell'ospite da impostare come titolare
     * @return la relazione aggiornata
     */
    @PatchMapping("/{ospiteId}/titolare")
    public ResponseEntity<OspitePrenotazioneDTO> setTitolare(
            @PathVariable Long prenotazioneId,
            @PathVariable Long ospiteId) {
        OspitePrenotazioneDTO updated = ospitePrenotazioneService.setTitolare(prenotazioneId, ospiteId);
        return ResponseEntity.ok(updated);
    }
}
