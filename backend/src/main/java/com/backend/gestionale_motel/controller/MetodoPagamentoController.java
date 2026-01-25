package com.backend.gestionale_motel.controller;

import com.backend.gestionale_motel.dto.MetodoPagamentoDTO;
import com.backend.gestionale_motel.service.MetodoPagamentoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller REST per la gestione dei metodi di pagamento
 */
@RestController
@RequestMapping("/api/metodi-pagamento")
@RequiredArgsConstructor
public class MetodoPagamentoController {

    private final MetodoPagamentoService metodoPagamentoService;

    /**
     * Recupera tutti i metodi di pagamento attivi
     * @return lista di MetodoPagamentoDTO
     */
    @GetMapping
    public ResponseEntity<List<MetodoPagamentoDTO>> findAll() {
        List<MetodoPagamentoDTO> metodi = metodoPagamentoService.findAll();
        return ResponseEntity.ok(metodi);
    }

    /**
     * Recupera un metodo di pagamento per ID
     * @param id identificativo del metodo di pagamento
     * @return il metodo di pagamento richiesto
     */
    @GetMapping("/{id}")
    public ResponseEntity<MetodoPagamentoDTO> findById(@PathVariable Long id) {
        MetodoPagamentoDTO metodo = metodoPagamentoService.findById(id);
        return ResponseEntity.ok(metodo);
    }

    /**
     * Crea un nuovo metodo di pagamento
     * @param dto dati del metodo di pagamento da creare
     * @return il metodo di pagamento creato
     */
    @PostMapping
    public ResponseEntity<MetodoPagamentoDTO> create(@Valid @RequestBody MetodoPagamentoDTO dto) {
        MetodoPagamentoDTO created = metodoPagamentoService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /**
     * Aggiorna un metodo di pagamento esistente
     * @param id identificativo del metodo di pagamento
     * @param dto nuovi dati del metodo di pagamento
     * @return il metodo di pagamento aggiornato
     */
    @PutMapping("/{id}")
    public ResponseEntity<MetodoPagamentoDTO> update(
            @PathVariable Long id,
            @Valid @RequestBody MetodoPagamentoDTO dto) {
        MetodoPagamentoDTO updated = metodoPagamentoService.update(id, dto);
        return ResponseEntity.ok(updated);
    }

    /**
     * Disattiva un metodo di pagamento (soft delete)
     * @param id identificativo del metodo di pagamento da disattivare
     * @return risposta senza contenuto
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        metodoPagamentoService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
