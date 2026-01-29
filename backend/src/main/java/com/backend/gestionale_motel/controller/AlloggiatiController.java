package com.backend.gestionale_motel.controller;

import com.backend.gestionale_motel.service.AlloggiatiService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

/**
 * Controller per l'export delle schedine Alloggiati Web (Polizia di Stato).
 */
@RestController
@RequestMapping("/api/alloggiati")
@RequiredArgsConstructor
public class AlloggiatiController {

    private final AlloggiatiService alloggiatiService;

    /**
     * Genera il file TXT per il Portale Alloggiati Web con gli arrivi di una specifica data.
     *
     * @param data data degli arrivi (default: oggi)
     * @return file TXT nel formato richiesto dal Portale Alloggiati
     */
    @GetMapping("/export")
    public ResponseEntity<byte[]> exportAlloggiati(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate data) {

        if (data == null) {
            data = LocalDate.now();
        }

        String contenuto = alloggiatiService.generaFileAlloggiati(data);

        String nomeFile = "alloggiati_" + data.format(DateTimeFormatter.ofPattern("yyyyMMdd")) + ".txt";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.TEXT_PLAIN);
        headers.set(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + nomeFile + "\"");
        headers.set(HttpHeaders.CACHE_CONTROL, "no-cache, no-store, must-revalidate");

        // Codifica in ISO-8859-1 (Latin-1) come richiesto dal portale
        byte[] bytes = contenuto.getBytes(java.nio.charset.StandardCharsets.ISO_8859_1);

        return ResponseEntity.ok()
                .headers(headers)
                .body(bytes);
    }
}
