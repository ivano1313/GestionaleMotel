package com.backend.gestionale_motel.dto;

import com.backend.gestionale_motel.entity.StatoPrenotazione;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * DTO per Prenotazione
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PrenotazioneDTO {

    private Long id;

    @NotNull(message = "La camera è obbligatoria")
    private Long cameraId;

    private String cameraNumero;

    @NotNull(message = "La data di check-in è obbligatoria")
    private LocalDate dataCheckin;

    @NotNull(message = "La data di check-out è obbligatoria")
    private LocalDate dataCheckout;

    private StatoPrenotazione stato;
    private BigDecimal prezzoTotale;
    private String note;
    private String nominativoTitolare;
}

