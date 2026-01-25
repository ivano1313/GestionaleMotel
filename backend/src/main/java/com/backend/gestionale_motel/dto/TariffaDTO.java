package com.backend.gestionale_motel.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * DTO per Tariffa
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TariffaDTO {

    private Long id;

    @NotNull(message = "La tipologia è obbligatoria")
    private Long tipologiaId;

    private String tipologiaNome;

    @NotNull(message = "Il periodo tariffario è obbligatorio")
    private Long periodoId;

    private String periodoNome;

    @NotNull(message = "Il prezzo per notte è obbligatorio")
    @DecimalMin(value = "0.01", message = "Il prezzo deve essere maggiore di zero")
    private BigDecimal prezzoPerNotte;
}

