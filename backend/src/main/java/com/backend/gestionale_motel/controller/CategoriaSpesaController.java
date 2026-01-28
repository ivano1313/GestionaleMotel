package com.backend.gestionale_motel.controller;

import com.backend.gestionale_motel.dto.CategoriaSpesaDTO;
import com.backend.gestionale_motel.service.CategoriaSpesaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller REST per la gestione delle categorie di spesa
 */
@RestController
@RequestMapping("/api/categorie-spesa")
@RequiredArgsConstructor
public class CategoriaSpesaController {

    private final CategoriaSpesaService categoriaSpesaService;

    /**
     * Recupera tutte le categorie di spesa attive
     * @return lista di CategoriaSpesaDTO
     */
    @GetMapping
    public ResponseEntity<List<CategoriaSpesaDTO>> findAll() {
        List<CategoriaSpesaDTO> categorie = categoriaSpesaService.findAll();
        return ResponseEntity.ok(categorie);
    }

    /**
     * Recupera una categoria di spesa per ID
     * @param id identificativo della categoria
     * @return la categoria richiesta
     */
    @GetMapping("/{id}")
    public ResponseEntity<CategoriaSpesaDTO> findById(@PathVariable Long id) {
        CategoriaSpesaDTO categoria = categoriaSpesaService.findById(id);
        return ResponseEntity.ok(categoria);
    }

    /**
     * Crea una nuova categoria di spesa
     * @param dto dati della categoria da creare
     * @return la categoria creata
     */
    @PostMapping
    public ResponseEntity<CategoriaSpesaDTO> create(@Valid @RequestBody CategoriaSpesaDTO dto) {
        CategoriaSpesaDTO created = categoriaSpesaService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /**
     * Aggiorna una categoria di spesa esistente
     * @param id identificativo della categoria
     * @param dto nuovi dati della categoria
     * @return la categoria aggiornata
     */
    @PutMapping("/{id}")
    public ResponseEntity<CategoriaSpesaDTO> update(
            @PathVariable Long id,
            @Valid @RequestBody CategoriaSpesaDTO dto) {
        CategoriaSpesaDTO updated = categoriaSpesaService.update(id, dto);
        return ResponseEntity.ok(updated);
    }

    /**
     * Disattiva una categoria di spesa (soft delete)
     * @param id identificativo della categoria da disattivare
     * @return risposta senza contenuto
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        categoriaSpesaService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
