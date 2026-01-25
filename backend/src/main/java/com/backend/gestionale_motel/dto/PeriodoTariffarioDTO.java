package com.backend.gestionale_motel.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * DTO per PeriodoTariffario
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PeriodoTariffarioDTO {

    private Long id;

    @NotBlank(message = "Il nome del periodo tariffario è obbligatorio")
    @Size(max = 100, message = "Il nome non può superare i 100 caratteri")
    private String nome;

    @NotNull(message = "La data di inizio è obbligatoria")
    private LocalDate dataInizio;

    @NotNull(message = "La data di fine è obbligatoria")
    private LocalDate dataFine;

    private Boolean attivo;
}

