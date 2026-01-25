package com.backend.gestionale_motel.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;

/**
 * DTO per Configurazione
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConfigurazioneDTO {

    private Long id;

    @NotNull(message = "L'orario di check-in è obbligatorio")
    private LocalTime orarioCheckin;

    @NotNull(message = "L'orario di check-out è obbligatorio")
    private LocalTime orarioCheckout;

    @NotNull(message = "La durata minima è obbligatoria")
    @Min(value = 1, message = "La durata minima deve essere almeno 1 giorno")
    private Integer durataMinima;

    @NotNull(message = "La durata massima è obbligatoria")
    @Min(value = 1, message = "La durata massima deve essere almeno 1 giorno")
    private Integer durataMassima;
}

