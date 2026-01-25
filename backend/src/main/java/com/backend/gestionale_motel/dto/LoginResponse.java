package com.backend.gestionale_motel.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO per la risposta del login.
 *
 * Inviato al frontend dopo login riuscito.
 * Contiene il token JWT che il frontend userà per le richieste successive.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {

    /**
     * Token JWT generato.
     * Il frontend lo salverà in localStorage e lo invierà nell'header Authorization.
     */
    private String token;
}
