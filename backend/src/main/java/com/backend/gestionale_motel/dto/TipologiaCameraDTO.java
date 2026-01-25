package com.backend.gestionale_motel.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO per TipologiaCamera
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TipologiaCameraDTO {

    private Long id;

    @NotBlank(message = "Il nome della tipologia è obbligatorio")
    @Size(max = 50, message = "Il nome non può superare i 50 caratteri")
    private String nome;

    @NotNull(message = "La capienza massima è obbligatoria")
    @Min(value = 1, message = "La capienza massima deve essere almeno 1")
    private Integer capienzaMassima;

    private String descrizione;
    private Boolean attivo;
}

