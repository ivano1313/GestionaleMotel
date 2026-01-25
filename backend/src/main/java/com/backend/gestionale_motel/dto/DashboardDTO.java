package com.backend.gestionale_motel.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

/**
 * DTO per la dashboard principale
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardDTO {

    // Statistiche generali
    private int arriviOggi;
    private int partenzeOggi;
    private int camereOccupate;
    private int camereDisponibili;
    private int camereDaPulire;

    // Statistiche finanziarie
    private BigDecimal incassiOggi;

    // Liste dettagliate
    private List<PrenotazioneDTO> arriviDelGiorno;
    private List<PrenotazioneDTO> partenzeDelGiorno;
}

