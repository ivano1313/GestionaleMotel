package com.backend.gestionale_motel.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * Controller per health check.
 * Endpoint pubblico usato per verificare che il servizio sia attivo.
 */
@RestController
@RequestMapping("/api/health")
public class HealthController {

    /**
     * Health check endpoint.
     * Restituisce lo stato del servizio.
     *
     * @return stato OK con timestamp
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("timestamp", LocalDateTime.now());
        response.put("service", "gestionale-motel");
        return ResponseEntity.ok(response);
    }
}
