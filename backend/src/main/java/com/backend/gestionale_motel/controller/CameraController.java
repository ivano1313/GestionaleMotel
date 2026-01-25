package com.backend.gestionale_motel.controller;

                                                                                                import com.backend.gestionale_motel.dto.CameraDTO;
import com.backend.gestionale_motel.entity.StatoPulizia;
import com.backend.gestionale_motel.service.CameraService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/**
 * Controller REST per la gestione delle camere
 */
@RestController
@RequestMapping("/api/camere")
@RequiredArgsConstructor
public class CameraController {

    private final CameraService cameraService;

    /**
     * Recupera tutte le camere
     * @return lista di CameraDTO
     */
    @GetMapping
    public ResponseEntity<List<CameraDTO>> findAll() {
        List<CameraDTO> camere = cameraService.findAll();
        return ResponseEntity.ok(camere);
    }

    /**
     * Recupera una camera per ID
     * @param id identificativo della camera
     * @return la camera richiesta
     */
    @GetMapping("/{id}")
    public ResponseEntity<CameraDTO> findById(@PathVariable Long id) {
        CameraDTO camera = cameraService.findById(id);
        return ResponseEntity.ok(camera);
    }

    /**
     * Recupera le camere disponibili per un periodo specificato
     * @param checkIn data di check-in (formato ISO: yyyy-MM-dd)
     * @param checkOut data di check-out (formato ISO: yyyy-MM-dd)
     * @return lista di camere disponibili
     */
    @GetMapping("/disponibili")
    public ResponseEntity<List<CameraDTO>> findDisponibili(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkIn,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOut) {
        List<CameraDTO> camere = cameraService.findDisponibili(checkIn, checkOut);
        return ResponseEntity.ok(camere);
    }

    /**
     * Recupera le camere che necessitano pulizia
     * @return lista di camere con stato DA_PULIRE
     */
    @GetMapping("/da-pulire")
    public ResponseEntity<List<CameraDTO>> findDaPulire() {
        List<CameraDTO> camere = cameraService.findDaPulire();
        return ResponseEntity.ok(camere);
    }

    /**
     * Crea una nuova camera
     * @param dto dati della camera da creare
     * @return la camera creata
     */
    @PostMapping
    public ResponseEntity<CameraDTO> create(@Valid @RequestBody CameraDTO dto) {
        CameraDTO created = cameraService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /**
     * Aggiorna una camera esistente
     * @param id identificativo della camera
     * @param dto nuovi dati della camera
     * @return la camera aggiornata
     */
    @PutMapping("/{id}")
    public ResponseEntity<CameraDTO> update(
            @PathVariable Long id,
            @Valid @RequestBody CameraDTO dto) {
        CameraDTO updated = cameraService.update(id, dto);
        return ResponseEntity.ok(updated);
    }

    /**
     * Cambia lo stato di pulizia di una camera
     * @param id identificativo della camera
     * @param stato nuovo stato di pulizia
     * @return la camera con lo stato aggiornato
     */
    @PatchMapping("/{id}/stato-pulizia")
    public ResponseEntity<CameraDTO> cambiaStatoPulizia(
            @PathVariable Long id,
            @RequestParam StatoPulizia stato) {
        CameraDTO updated = cameraService.cambiaStatoPulizia(id, stato);
        return ResponseEntity.ok(updated);
    }
}
