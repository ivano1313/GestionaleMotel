package com.backend.gestionale_motel.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SpesaDTO {

    private Long id;

    @NotNull(message = "La categoria è obbligatoria")
    private Long categoriaId;

    // Campo popolato dal service per comodità frontend
    private String categoriaNome;

    @NotBlank(message = "La descrizione è obbligatoria")
    @Size(max = 255, message = "La descrizione non può superare i 255 caratteri")
    private String descrizione;

    @NotNull(message = "L'importo è obbligatorio")
    @DecimalMin(value = "0.01", message = "L'importo deve essere maggiore di zero")
    private BigDecimal importo;

    @NotNull(message = "La data della spesa è obbligatoria")
    private LocalDate dataSpesa;

    private String note;

    private Boolean attivo;
}
