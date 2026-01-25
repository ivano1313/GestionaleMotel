package com.backend.gestionale_motel.controller;

import com.backend.gestionale_motel.dto.PagamentoDTO;
import com.backend.gestionale_motel.service.PagamentoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

/**
 * Controller REST per la gestione dei pagamenti
 */
@RestController
@RequestMapping("/api/prenotazioni/{prenotazioneId}/pagamenti")
@RequiredArgsConstructor
public class PagamentoController {

    private final PagamentoService pagamentoService;

    /**
     * Recupera tutti i pagamenti di una prenotazione
     * @param prenotazioneId identificativo della prenotazione
     * @return lista di pagamenti effettuati
     */
    @GetMapping
    public ResponseEntity<List<PagamentoDTO>> findByPrenotazione(@PathVariable Long prenotazioneId) {
        List<PagamentoDTO> pagamenti = pagamentoService.findByPrenotazione(prenotazioneId);
        return ResponseEntity.ok(pagamenti);
    }

    /**
     * Calcola il totale già pagato per una prenotazione
     * @param prenotazioneId identificativo della prenotazione
     * @return somma di tutti i pagamenti effettuati
     */
    @GetMapping("/totale-pagato")
    public ResponseEntity<BigDecimal> getTotalePagato(@PathVariable Long prenotazioneId) {
        BigDecimal totale = pagamentoService.getTotalePagato(prenotazioneId);
        return ResponseEntity.ok(totale);
    }

    /**
     * Calcola il saldo dovuto per una prenotazione (prezzo totale - totale pagato)
     * @param prenotazioneId identificativo della prenotazione
     * @return importo del saldo ancora da pagare
     */
    @GetMapping("/saldo-dovuto")
    public ResponseEntity<BigDecimal> getSaldoDovuto(@PathVariable Long prenotazioneId) {
        BigDecimal saldo = pagamentoService.getSaldoDovuto(prenotazioneId);
        return ResponseEntity.ok(saldo);
    }

    /**
     * Registra un nuovo pagamento per una prenotazione
     * Il timestamp viene impostato automaticamente dal sistema
     * @param prenotazioneId identificativo della prenotazione
     * @param dto dati del pagamento da registrare
     * @return il pagamento registrato
     */
    @PostMapping
    public ResponseEntity<PagamentoDTO> create(
            @PathVariable Long prenotazioneId,
            @Valid @RequestBody PagamentoDTO dto) {
        // Assicura che il prenotazioneId nel path coincida con quello nel DTO
        dto.setPrenotazioneId(prenotazioneId);

        PagamentoDTO created = pagamentoService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
}
