package com.backend.gestionale_motel.controller;

import com.backend.gestionale_motel.dto.TipoDocumentoDTO;
import com.backend.gestionale_motel.service.TipoDocumentoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller REST per la gestione dei Tipi Documento (tabella lookup - sola lettura)
 */
@RestController
@RequestMapping("/api/tipi-documento")
@RequiredArgsConstructor
public class TipoDocumentoController {

    private final TipoDocumentoService tipoDocumentoService;

    /**
     * Recupera tutti i tipi di documento attivi
     * Include documenti italiani (CI, PS, PT) ed esteri
     * @return lista di tipi documento
     */
    @GetMapping
    public ResponseEntity<List<TipoDocumentoDTO>> findAll() {
        List<TipoDocumentoDTO> tipiDocumento = tipoDocumentoService.findAll();
        return ResponseEntity.ok(tipiDocumento);
    }
}
