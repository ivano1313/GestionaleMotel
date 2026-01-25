package com.backend.gestionale_motel.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO per la richiesta di login.
 *
 * Ricevuto dal frontend nell'endpoint POST /api/auth/login
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {

    @NotBlank(message = "Lo username è obbligatorio")
    private String username;

    @NotBlank(message = "La password è obbligatoria")
    private String password;
}
