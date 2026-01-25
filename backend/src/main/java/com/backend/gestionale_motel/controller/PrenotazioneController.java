package com.backend.gestionale_motel.controller;

import com.backend.gestionale_motel.dto.PrenotazioneDTO;
import com.backend.gestionale_motel.entity.StatoPrenotazione;
import com.backend.gestionale_motel.service.PrenotazioneService;
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
 * Controller REST per la gestione delle prenotazioni
 */
@RestController
@RequestMapping("/api/prenotazioni")
@RequiredArgsConstructor
public class PrenotazioneController {

    private final PrenotazioneService prenotazioneService;

    /**
     * Recupera tutte le prenotazioni
     * @return lista di PrenotazioneDTO
     */
    @GetMapping
    public ResponseEntity<List<PrenotazioneDTO>> findAll() {
        List<PrenotazioneDTO> prenotazioni = prenotazioneService.findAll();
        return ResponseEntity.ok(prenotazioni);
    }

    /**
     * Recupera una prenotazione per ID
     * @param id identificativo della prenotazione
     * @return la prenotazione richiesta
     */
    @GetMapping("/{id}")
    public ResponseEntity<PrenotazioneDTO> findById(@PathVariable Long id) {
        PrenotazioneDTO prenotazione = prenotazioneService.findById(id);
        return ResponseEntity.ok(prenotazione);
    }

    /**
     * Recupera le prenotazioni in arrivo oggi
     * @return lista di prenotazioni con check-in oggi
     */
    @GetMapping("/arrivi-oggi")
    public ResponseEntity<List<PrenotazioneDTO>> findArriviOggi() {
        List<PrenotazioneDTO> arrivi = prenotazioneService.findArriviOggi();
        return ResponseEntity.ok(arrivi);
    }

    /**
     * Recupera le prenotazioni in partenza oggi
     * @return lista di prenotazioni con check-out oggi
     */
    @GetMapping("/partenze-oggi")
    public ResponseEntity<List<PrenotazioneDTO>> findPartenzeOggi() {
        List<PrenotazioneDTO> partenze = prenotazioneService.findPartenzeOggi();
        return ResponseEntity.ok(partenze);
    }

    /**
     * Recupera le prenotazioni attualmente attive
     * @return lista di prenotazioni in corso
     */
    @GetMapping("/attive")
    public ResponseEntity<List<PrenotazioneDTO>> findAttive() {
        List<PrenotazioneDTO> attive = prenotazioneService.findAttive();
        return ResponseEntity.ok(attive);
    }

    /**
     * Calcola il saldo dovuto per una prenotazione (prezzo totale - totale pagato)
     * @param id identificativo della prenotazione
     * @return importo del saldo dovuto
     */
    @GetMapping("/{id}/saldo-dovuto")
    public ResponseEntity<BigDecimal> calcolaSaldoDovuto(@PathVariable Long id) {
        BigDecimal saldo = prenotazioneService.calcolaSaldoDovuto(id);
        return ResponseEntity.ok(saldo);
    }

    /**
     * Verifica se una camera è disponibile nel periodo specificato
     * @param cameraId identificativo della camera
     * @param checkIn data di check-in (formato ISO: yyyy-MM-dd)
     * @param checkOut data di check-out (formato ISO: yyyy-MM-dd)
     * @return true se la camera è disponibile, false altrimenti
     */
    @GetMapping("/verifica-disponibilita")
    public ResponseEntity<Boolean> verificaDisponibilita(
            @RequestParam Long cameraId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkIn,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOut) {
        boolean disponibile = prenotazioneService.verificaDisponibilita(cameraId, checkIn, checkOut);
        return ResponseEntity.ok(disponibile);
    }

    /**
     * Crea una nuova prenotazione
     * Il prezzo viene calcolato automaticamente in base alle tariffe configurate
     * @param dto dati della prenotazione da creare
     * @return la prenotazione creata
     */
    @PostMapping
    public ResponseEntity<PrenotazioneDTO> create(@Valid @RequestBody PrenotazioneDTO dto) {
        PrenotazioneDTO created = prenotazioneService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /**
     * Cambia lo stato di una prenotazione
     * Le transizioni valide sono:
     * - CONFERMATA -> IN_CORSO, CANCELLATA
     * - IN_CORSO -> COMPLETATA, CANCELLATA
     * - COMPLETATA/CANCELLATA -> nessuna transizione (stati finali)
     * @param id identificativo della prenotazione
     * @param stato nuovo stato della prenotazione
     * @return la prenotazione con lo stato aggiornato
     */
    @PatchMapping("/{id}/stato")
    public ResponseEntity<PrenotazioneDTO> cambiaStato(
            @PathVariable Long id,
            @RequestParam StatoPrenotazione stato) {
        PrenotazioneDTO updated = prenotazioneService.cambiaStato(id, stato);
        return ResponseEntity.ok(updated);
    }
}
